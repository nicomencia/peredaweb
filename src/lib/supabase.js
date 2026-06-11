// Drop-in replacement for the supabase-js client, backed by the PHP/MySQL
// API on the same host. Implements exactly the query surface this app uses:
//   from(t).select().eq().in().or().order().maybeSingle()/single()
//   from(t).insert(data).select().maybeSingle()
//   from(t).update(data).eq(col, val)
//   from(t).delete().eq(col, val)
//   auth.getSession / onAuthStateChange / signInWithPassword / signOut
// All read queries fetch the whole (small) table and filter client-side.

const API_BASE = import.meta.env.VITE_API_BASE || '';

async function apiFetch(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    credentials: 'include',
    ...options,
  });
  const body = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(body?.error || `HTTP ${res.status}`);
  }
  return body;
}

function postJson(path, payload) {
  return apiFetch(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

// Parses the PostgREST .or() syntax used in App.jsx:
//   "key.in.(a,b,c),key.like.prefix_%"
function parseOrExpression(expr) {
  const parts = [];
  let depth = 0;
  let current = '';
  for (const ch of expr) {
    if (ch === '(') depth++;
    if (ch === ')') depth--;
    if (ch === ',' && depth === 0) {
      parts.push(current);
      current = '';
    } else {
      current += ch;
    }
  }
  if (current) parts.push(current);

  const predicates = parts.map((part) => {
    const inMatch = part.match(/^(\w+)\.in\.\((.*)\)$/);
    if (inMatch) {
      const values = inMatch[2].split(',').map((v) => v.trim());
      return (row) => values.includes(String(row[inMatch[1]]));
    }
    const likeMatch = part.match(/^(\w+)\.like\.(.*)$/);
    if (likeMatch) {
      const re = new RegExp('^' + likeMatch[2].replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/%/g, '.*') + '$');
      return (row) => re.test(String(row[likeMatch[1]] ?? ''));
    }
    return () => false;
  });
  return (row) => predicates.some((p) => p(row));
}

function matches(row, col, value) {
  if (typeof value === 'boolean') return Boolean(row[col]) === value;
  return row[col] === value || String(row[col]) === String(value);
}

class QueryBuilder {
  constructor(table) {
    this.table = table;
    this.action = 'select';
    this.payload = null;
    this.filters = [];
    this.where = null; // {column, value} for update/delete
    this.orderings = [];
    this.singleMode = null; // 'single' | 'maybeSingle'
  }

  select() { return this; }

  insert(data) { this.action = 'insert'; this.payload = data; return this; }
  update(data) { this.action = 'update'; this.payload = data; return this; }
  delete() { this.action = 'delete'; return this; }

  eq(col, value) {
    if (this.action === 'update' || this.action === 'delete') {
      this.where = { column: col, value };
    } else {
      this.filters.push((row) => matches(row, col, value));
    }
    return this;
  }

  in(col, values) {
    const set = values.map(String);
    this.filters.push((row) => set.includes(String(row[col])));
    return this;
  }

  or(expr) {
    this.filters.push(parseOrExpression(expr));
    return this;
  }

  order(col, { ascending = true } = {}) {
    this.orderings.push({ col, ascending });
    return this;
  }

  maybeSingle() { this.singleMode = 'maybeSingle'; return this; }
  single() { this.singleMode = 'single'; return this; }

  async _execute() {
    if (this.action === 'select') {
      let rows = await apiFetch(`/api/content.php?resource=${this.table}`);
      rows = rows.filter((row) => this.filters.every((f) => f(row)));
      for (const { col, ascending } of [...this.orderings].reverse()) {
        rows.sort((a, b) => {
          const av = a[col], bv = b[col];
          if (av === bv) return 0;
          if (av === null || av === undefined) return 1;
          if (bv === null || bv === undefined) return -1;
          const cmp = typeof av === 'number' && typeof bv === 'number' ? av - bv : String(av).localeCompare(String(bv));
          return ascending ? cmp : -cmp;
        });
      }
      if (this.singleMode) {
        if (this.singleMode === 'single' && rows.length !== 1) throw new Error('Expected a single row');
        return rows[0] ?? null;
      }
      return rows;
    }

    if (this.action === 'insert') {
      const items = Array.isArray(this.payload) ? this.payload : [this.payload];
      const inserted = [];
      for (const item of items) {
        inserted.push(await postJson('/api/admin.php', { action: 'insert', resource: this.table, data: item }));
      }
      if (this.singleMode) return inserted[0] ?? null;
      return Array.isArray(this.payload) ? inserted : inserted[0];
    }

    if (this.action === 'update') {
      return postJson('/api/admin.php', { action: 'update', resource: this.table, data: this.payload, where: this.where });
    }

    if (this.action === 'delete') {
      return postJson('/api/admin.php', { action: 'delete', resource: this.table, where: this.where });
    }
    throw new Error(`Unsupported action: ${this.action}`);
  }

  // supabase-js queries are thenables resolving to {data, error}
  then(onFulfilled, onRejected) {
    return this._execute()
      .then((data) => ({ data, error: null }))
      .catch((err) => ({ data: null, error: { message: err.message } }))
      .then(onFulfilled, onRejected);
  }
}

const authListeners = new Set();

function notifyAuth(event, session) {
  authListeners.forEach((cb) => cb(event, session));
}

export const supabase = {
  from(table) {
    return new QueryBuilder(table);
  },

  auth: {
    async getSession() {
      try {
        const res = await postJson('/api/auth.php', { action: 'check' });
        return { data: { session: res.authenticated ? {} : null } };
      } catch {
        return { data: { session: null } };
      }
    },

    onAuthStateChange(callback) {
      authListeners.add(callback);
      return { data: { subscription: { unsubscribe: () => authListeners.delete(callback) } } };
    },

    async signInWithPassword({ email, password }) {
      try {
        await postJson('/api/auth.php', { action: 'login', email, password });
        notifyAuth('SIGNED_IN', {});
        return { data: { session: {}, user: { email } }, error: null };
      } catch (err) {
        return { data: {}, error: { message: err.message } };
      }
    },

    async signOut() {
      try {
        await postJson('/api/auth.php', { action: 'logout' });
      } finally {
        notifyAuth('SIGNED_OUT', null);
      }
      return { error: null };
    },
  },
};
