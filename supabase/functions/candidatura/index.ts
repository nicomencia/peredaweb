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

async function sendNotificationEmail(
  nombre: string,
  email: string,
  telefono: string,
  mensaje: string,
  cvUrl: string,
  supabaseUrl: string
) {
  const resendKey = Deno.env.get("RESEND_API_KEY");
  if (!resendKey) return;

  const cvSection = cvUrl
    ? `<p><strong>CV:</strong> ${supabaseUrl}/storage/v1/object/public/cvs/${cvUrl}</p>`
    : `<p><strong>CV:</strong> No adjuntado</p>`;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #333; border-bottom: 2px solid #e0e0e0; padding-bottom: 10px;">Nueva candidatura recibida</h2>
      <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
        <tr>
          <td style="padding: 8px 12px; font-weight: bold; color: #555; width: 120px;">Nombre:</td>
          <td style="padding: 8px 12px;">${nombre}</td>
        </tr>
        <tr style="background: #f9f9f9;">
          <td style="padding: 8px 12px; font-weight: bold; color: #555;">Email:</td>
          <td style="padding: 8px 12px;"><a href="mailto:${email}">${email}</a></td>
        </tr>
        <tr>
          <td style="padding: 8px 12px; font-weight: bold; color: #555;">Telefono:</td>
          <td style="padding: 8px 12px;">${telefono || "No proporcionado"}</td>
        </tr>
        <tr style="background: #f9f9f9;">
          <td style="padding: 8px 12px; font-weight: bold; color: #555;">Mensaje:</td>
          <td style="padding: 8px 12px;">${mensaje || "Sin mensaje"}</td>
        </tr>
      </table>
      ${cvSection}
      <p style="color: #999; font-size: 12px; margin-top: 24px; border-top: 1px solid #eee; padding-top: 12px;">
        Este email se ha generado automaticamente desde el formulario de candidaturas de la web.
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
      from: "Candidaturas <onboarding@resend.dev>",
      to: ["ines@saneamientos-pereda.com"],
      subject: `Nueva candidatura: ${nombre}`,
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

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabase = createClient(
      supabaseUrl,
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

    await sendNotificationEmail(nombre, email, telefono, mensaje, cvUrl, supabaseUrl);

    return jsonResponse({ success: true }, 201);
  } catch {
    return jsonResponse({ error: "Error interno del servidor" }, 500);
  }
});
