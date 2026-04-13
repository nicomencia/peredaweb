import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.76.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, X-Client-Info, Apikey",
};

function generatePin(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let pin = "";
  const array = new Uint8Array(8);
  crypto.getRandomValues(array);
  for (let i = 0; i < 8; i++) {
    pin += chars[array[i] % chars.length];
  }
  return pin;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const url = new URL(req.url);
    const path = url.pathname.replace(/^\/denuncias\/?/, "");

    if (req.method === "POST" && (path === "" || path === "submit")) {
      const body = await req.json();
      const { hechos, seccion_lugar, vinculacion, personas_involucradas, momento, documentos_info } = body;

      if (!hechos || hechos.trim().length === 0) {
        return new Response(
          JSON.stringify({ error: "La exposicion de los hechos es obligatoria" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      let pin = generatePin();
      let attempts = 0;
      while (attempts < 10) {
        const { data: existing } = await supabase
          .from("denuncias")
          .select("id")
          .eq("pin", pin)
          .maybeSingle();
        if (!existing) break;
        pin = generatePin();
        attempts++;
      }

      const { data, error } = await supabase.from("denuncias").insert({
        pin,
        hechos: hechos.trim(),
        seccion_lugar: (seccion_lugar || "").trim(),
        vinculacion: (vinculacion || "").trim(),
        personas_involucradas: (personas_involucradas || "").trim(),
        momento: (momento || "").trim(),
        documentos_info: (documentos_info || "").trim(),
      }).select("pin").maybeSingle();

      if (error) {
        return new Response(
          JSON.stringify({ error: "Error al enviar la denuncia" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({ pin: data?.pin }),
        { status: 201, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (req.method === "POST" && path === "consultar") {
      const body = await req.json();
      const { pin } = body;

      if (!pin || pin.trim().length === 0) {
        return new Response(
          JSON.stringify({ error: "El PIN es obligatorio" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const { data, error } = await supabase
        .from("denuncias")
        .select("hechos, estado, respuesta, created_at, updated_at")
        .eq("pin", pin.trim().toUpperCase())
        .maybeSingle();

      if (error || !data) {
        return new Response(
          JSON.stringify({ error: "No se encontro ninguna denuncia con ese PIN" }),
          { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({ denuncia: data }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ error: "Ruta no encontrada" }),
      { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: "Error interno del servidor" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
