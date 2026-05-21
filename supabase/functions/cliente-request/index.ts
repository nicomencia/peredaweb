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

function escape(value: string) {
  return (value || "").replace(/[&<>"']/g, (c) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  }[c] as string));
}

async function sendNotificationEmail(payload: Record<string, string>) {
  const resendKey = Deno.env.get("RESEND_API_KEY");
  if (!resendKey) return;

  const rows = [
    ["Nombre", payload.nombre],
    ["Empresa", payload.empresa],
    ["CIF / NIF", payload.cif],
    ["Localidad", payload.localidad],
    ["Telefono", payload.telefono],
    ["Email", payload.email],
    ["Actividad", payload.actividad],
    ["Mensaje", payload.mensaje],
  ];

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #333; border-bottom: 2px solid #e0e0e0; padding-bottom: 10px;">Nueva solicitud de alta de cliente</h2>
      <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
        ${rows.map(([label, value], i) => `
          <tr${i % 2 === 1 ? ' style="background: #f9f9f9;"' : ""}>
            <td style="padding: 8px 12px; font-weight: bold; color: #555; width: 140px; vertical-align: top;">${escape(label)}:</td>
            <td style="padding: 8px 12px;">${escape(value || "No proporcionado")}</td>
          </tr>
        `).join("")}
      </table>
      <p style="color: #999; font-size: 12px; margin-top: 24px; border-top: 1px solid #eee; padding-top: 12px;">
        Email generado automaticamente desde el formulario "Hazte cliente".
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
      from: "Hazte Cliente <onboarding@resend.dev>",
      to: ["ines@saneamientos-pereda.com"],
      subject: `Nueva solicitud de cliente: ${payload.nombre}`,
      html,
    }),
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

    const body = await req.json();
    const nombre = (body.nombre || "").trim();
    const empresa = (body.empresa || "").trim();
    const cif = (body.cif || "").trim();
    const localidad = (body.localidad || "").trim();
    const telefono = (body.telefono || "").trim();
    const email = (body.email || "").trim();
    const actividad = (body.actividad || "").trim();
    const mensaje = (body.mensaje || "").trim();

    if (!nombre) return jsonResponse({ error: "El nombre es obligatorio" }, 400);
    if (!email) return jsonResponse({ error: "El email es obligatorio" }, 400);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return jsonResponse({ error: "El formato del email no es valido" }, 400);
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { error } = await supabase.from("cliente_requests").insert({
      nombre, empresa, cif, localidad, telefono, email, actividad, mensaje,
    });

    if (error) {
      return jsonResponse({ error: "Error al guardar la solicitud" }, 500);
    }

    await sendNotificationEmail({
      nombre, empresa, cif, localidad, telefono, email, actividad, mensaje,
    });

    return jsonResponse({ success: true }, 201);
  } catch {
    return jsonResponse({ error: "Error interno del servidor" }, 500);
  }
});
