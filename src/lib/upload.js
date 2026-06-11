const API_BASE = import.meta.env.VITE_API_BASE || '';

const MAX_DIMENSION = 1920;
const WEBP_QUALITY = 0.82;
// Files this small are already web-friendly; recompressing only loses quality.
const SKIP_BELOW_BYTES = 150 * 1024;

async function optimizeImage(file) {
  // Vector and animated formats pass through untouched.
  if (file.type === 'image/svg+xml' || file.type === 'image/gif') return file;

  let bitmap;
  try {
    bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' });
  } catch {
    return file;
  }

  const scale = Math.min(1, MAX_DIMENSION / Math.max(bitmap.width, bitmap.height));
  if (scale === 1 && file.size < SKIP_BELOW_BYTES) {
    bitmap.close();
    return file;
  }

  const canvas = document.createElement('canvas');
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext('2d').drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();

  const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/webp', WEBP_QUALITY));
  if (!blob || blob.size >= file.size) return file;

  const baseName = file.name.replace(/\.[^.]+$/, '');
  return new File([blob], `${baseName}.webp`, { type: 'image/webp' });
}

export async function uploadImage(file, folder = 'uploads') {
  const optimized = await optimizeImage(file);

  const form = new FormData();
  form.append('file', optimized);
  form.append('folder', folder);

  const res = await fetch(`${API_BASE}/api/upload.php`, {
    method: 'POST',
    credentials: 'include',
    body: form,
  });
  const body = await res.json().catch(() => null);
  if (!res.ok || !body?.success) {
    throw new Error(body?.error || `Error al subir (HTTP ${res.status})`);
  }
  return body.url;
}
