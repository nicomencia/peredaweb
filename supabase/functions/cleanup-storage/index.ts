import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const token = authHeader.replace("Bearer ", "");
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const referencedUrls = new Set<string>();

    const { data: settings } = await supabase
      .from("site_settings")
      .select("value")
      .in("key", ["hero_logo", "hero_background", "navbar_logo"]);
    if (settings) {
      for (const row of settings) {
        if (row.value) referencedUrls.add(row.value);
      }
    }

    const { data: ambientes } = await supabase
      .from("ambientes")
      .select("cover_image_url");
    if (ambientes) {
      for (const row of ambientes) {
        if (row.cover_image_url) referencedUrls.add(row.cover_image_url);
      }
    }

    const { data: photos } = await supabase
      .from("ambiente_photos")
      .select("image_url");
    if (photos) {
      for (const row of photos) {
        if (row.image_url) referencedUrls.add(row.image_url);
      }
    }

    const referencedPaths = new Set<string>();
    for (const url of referencedUrls) {
      const match = url.match(/\/storage\/v1\/object\/public\/site-assets\/(.+)/);
      if (match) {
        referencedPaths.add(match[1]);
      }
    }

    const folders = ["logo", "background", "ambientes"];
    const allStoredPaths: string[] = [];

    for (const folder of folders) {
      const files = await listAllFiles(supabase, "site-assets", folder);
      allStoredPaths.push(...files);
    }

    const orphaned = allStoredPaths.filter((p) => !referencedPaths.has(p));

    if (orphaned.length === 0) {
      return new Response(
        JSON.stringify({ deleted: 0, message: "No hay archivos sin usar." }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { error: deleteError } = await supabase.storage
      .from("site-assets")
      .remove(orphaned);

    if (deleteError) {
      return new Response(
        JSON.stringify({ error: deleteError.message }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({
        deleted: orphaned.length,
        files: orphaned,
        message: `Se eliminaron ${orphaned.length} archivo(s) sin usar.`,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: (err as Error).message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

async function listAllFiles(
  supabase: ReturnType<typeof createClient>,
  bucket: string,
  folder: string
): Promise<string[]> {
  const paths: string[] = [];
  const { data, error } = await supabase.storage.from(bucket).list(folder, {
    limit: 1000,
  });
  if (error || !data) return paths;
  for (const item of data) {
    if (item.id) {
      paths.push(`${folder}/${item.name}`);
    } else {
      const nested = await listAllFiles(supabase, bucket, `${folder}/${item.name}`);
      paths.push(...nested);
    }
  }
  return paths;
}
