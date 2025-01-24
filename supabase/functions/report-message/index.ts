import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { SmtpClient } from "https://deno.land/x/smtp@v0.7.0/mod.ts";

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

    const smtpPassword = Deno.env.get("SMTP_PASSWORD");
    if (!smtpPassword) {
      throw new Error("SMTP_PASSWORD environment variable is not set");
    }

    const client = new SmtpClient();

    try {
      console.log("Attempting SMTP connection...");
      
      await client.connectTLS({
        hostname: "mail.maneblod.com",
        port: 465,
        username: "_mainaccount@maneblod.com",
        password: smtpPassword,
      });

      console.log("SMTP connection established, sending email...");

      const emailData = {
        from: "_mainaccount@maneblod.com",
        to: "_mainaccount@maneblod.com",
        subject: "Reported Message from Openera",
        content: `A message has been reported:\n\n${message}`,
        html: `<p>A message has been reported:</p><p>${message}</p>`,
      };

      await client.send(emailData);
      console.log("Email sent successfully");

      return new Response(
        JSON.stringify({ message: "Report sent successfully" }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    } catch (smtpError) {
      console.error("SMTP Error:", smtpError);
      throw new Error(`SMTP Error: ${smtpError.message}`);
    } finally {
      try {
        await client.close();
        console.log("SMTP connection closed");
      } catch (closeError) {
        console.error("Error closing SMTP connection:", closeError);
      }
    }
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