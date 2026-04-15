import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.76.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, X-Client-Info, Apikey",
};

function jsonResponse(body: Record<string, unknown>, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    if (req.method !== "POST") {
      return jsonResponse({ error: "Metodo no permitido" }, 405);
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const formData = await req.formData();
    const nombre = (formData.get("nombre") as string || "").trim();
    const email = (formData.get("email") as string || "").trim();
    const telefono = (formData.get("telefono") as string || "").trim();
    const mensaje = (formData.get("mensaje") as string || "").trim();
    const cvFile = formData.get("cv") as File | null;

    if (!nombre) {
      return jsonResponse({ error: "El nombre es obligatorio" }, 400);
    }

    if (!email) {
      return jsonResponse({ error: "El email es obligatorio" }, 400);
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return jsonResponse({ error: "El formato del email no es valido" }, 400);
    }

    let cvUrl = "";

    if (cvFile && cvFile.size > 0) {
      if (cvFile.type !== "application/pdf") {
        return jsonResponse({ error: "Solo se permiten archivos PDF" }, 400);
      }

      if (cvFile.size > 5 * 1024 * 1024) {
        return jsonResponse({ error: "El archivo no puede superar 5 MB" }, 400);
      }

      const timestamp = Date.now();
      const safeName = nombre.replace(/[^a-zA-Z0-9]/g, "_").toLowerCase();
      const filePath = `${safeName}_${timestamp}.pdf`;

      const { error: uploadError } = await supabase.storage
        .from("cvs")
        .upload(filePath, cvFile, {
          contentType: "application/pdf",
          upsert: false,
        });

      if (uploadError) {
        return jsonResponse({ error: "Error al subir el archivo" }, 500);
      }

      cvUrl = filePath;
    }

    const { error } = await supabase.from("job_applications").insert({
      nombre,
      email,
      telefono,
      mensaje,
      cv_url: cvUrl,
    });

    if (error) {
      return jsonResponse({ error: "Error al enviar la candidatura" }, 500);
    }

    return jsonResponse({ success: true }, 201);
  } catch {
    return jsonResponse({ error: "Error interno del servidor" }, 500);
  }
});
