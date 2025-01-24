import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { SmtpClient } from "https://deno.land/x/smtp@v0.13.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message } = await req.json();
    console.log("Received message to report:", message);

    const client = new SmtpClient();
    console.log("Initializing SMTP client...");

    // Configure connection
    await client.connectTLS({
      hostname: "mail.maneblod.com",
      port: 465,
      username: "manebl@maneblod.com",
      password: Deno.env.get("SMTP_PASSWORD") || "",
    });
    console.log("SMTP connection established");

    // Send the email
    await client.send({
      from: "manebl@maneblod.com",
      to: "manebl@maneblod.com",
      subject: "Reported Message from Openera",
      content: `A message has been reported:\n\n${message}`,
    });
    console.log("Email sent successfully");

    // Close the connection
    await client.close();
    console.log("SMTP connection closed");

    return new Response(
      JSON.stringify({ message: "Report sent successfully" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error in report-message function:", error);
    
    return new Response(
      JSON.stringify({ 
        error: "Failed to send report",
        details: error.message,
        stack: error.stack 
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});