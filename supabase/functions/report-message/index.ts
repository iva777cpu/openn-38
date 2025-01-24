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

    const connectConfig = {
      hostname: "mail.maneblod.com",
      port: 465,
      username: "_mainaccount@maneblod.com",
      password: smtpPassword,
      tls: true,
      debug: true,
      timeout: 10000, // 10 second timeout
    };

    try {
      console.log("Attempting to connect to SMTP server with config:", {
        hostname: connectConfig.hostname,
        port: connectConfig.port,
        username: connectConfig.username,
        tls: connectConfig.tls
      });
      
      await client.connectTLS(connectConfig);
      console.log("Successfully connected to SMTP server");

      const emailContent = {
        from: "_mainaccount@maneblod.com",
        to: "churlly2018@gmail.com", // Forward to this email as shown in your screenshot
        subject: "Reported Message from Openera",
        content: `A message has been reported:\n\n${message}`,
        html: `<p>A message has been reported:</p><p>${message}</p>`,
      };

      console.log("Attempting to send email with content:", {
        from: emailContent.from,
        to: emailContent.to,
        subject: emailContent.subject
      });
      
      await client.send(emailContent);
      console.log("Email sent successfully");

      await client.close();
      console.log("SMTP connection closed");

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