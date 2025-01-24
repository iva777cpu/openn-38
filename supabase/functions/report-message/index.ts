import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { SmtpClient } from "https://deno.land/x/smtp@v0.7.0/mod.ts";

const SMTP_HOSTNAME = Deno.env.get("SMTP_HOSTNAME");
const SMTP_PORT = parseInt(Deno.env.get("SMTP_PORT") || "587");
const SMTP_USERNAME = Deno.env.get("SMTP_USERNAME");
const SMTP_PASSWORD = Deno.env.get("SMTP_PASSWORD");
const TO_EMAIL = Deno.env.get("TO_EMAIL");
const FROM_EMAIL = Deno.env.get("FROM_EMAIL");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ReportRequest {
  message: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message }: ReportRequest = await req.json();
    console.log("Sending report email for message:", message);

    const client = new SmtpClient();

    await client.connectTLS({
      hostname: SMTP_HOSTNAME!,
      port: SMTP_PORT,
      username: SMTP_USERNAME!,
      password: SMTP_PASSWORD!,
    });

    await client.send({
      from: FROM_EMAIL!,
      to: TO_EMAIL!,
      subject: "Message Reported in Openera",
      content: `
        <h2>A message has been reported in Openera</h2>
        <p>Here's the reported message:</p>
        <blockquote style="background: #f9f9f9; border-left: 4px solid #ccc; margin: 1.5em 10px; padding: 1em 10px;">
          ${message}
        </blockquote>
      `,
      html: true,
    });

    await client.close();

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Error in report-message function:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
};

serve(handler);