import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.76.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, X-Client-Info, Apikey",
};

function escape(value: string) {
  return (value || "").replace(/[&<>"']/g, (c) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  }[c] as string));
}

async function sendDenunciaEmail(pin: string, data: Record<string, string>) {
  const resendKey = Deno.env.get("RESEND_API_KEY");
  if (!resendKey) return;

  const rows = [
    ["PIN", pin],
    ["Hechos", data.hechos],
    ["Seccion y lugar", data.seccion_lugar],
    ["Vinculacion", data.vinculacion],
    ["Personas involucradas", data.personas_involucradas],
    ["Momento", data.momento],
    ["Documentacion adicional", data.documentos_info],
  ];

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #333; border-bottom: 2px solid #e0e0e0; padding-bottom: 10px;">Nueva denuncia recibida</h2>
      <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
        ${rows.map(([label, value], i) => `
          <tr${i % 2 === 1 ? ' style="background: #f9f9f9;"' : ""}>
            <td style="padding: 8px 12px; font-weight: bold; color: #555; width: 180px; vertical-align: top;">${escape(label)}:</td>
            <td style="padding: 8px 12px; white-space: pre-wrap;">${escape(value || "No proporcionado")}</td>
          </tr>
        `).join("")}
      </table>
      <p style="color: #999; font-size: 12px; margin-top: 24px; border-top: 1px solid #eee; padding-top: 12px;">
        Email generado automaticamente desde el Canal de Denuncias.
      </p>
    </div>
  `;

  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${resendKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "Canal Denuncias <onboarding@resend.dev>",
      to: ["ines@saneamientos-pereda.com"],
      subject: `Nueva denuncia recibida (PIN: ${pin})`,
      html,
    }),
  });
}

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

      await sendDenunciaEmail(pin, {
        hechos: hechos.trim(),
        seccion_lugar: (seccion_lugar || "").trim(),
        vinculacion: (vinculacion || "").trim(),
        personas_involucradas: (personas_involucradas || "").trim(),
        momento: (momento || "").trim(),
        documentos_info: (documentos_info || "").trim(),
      });

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
