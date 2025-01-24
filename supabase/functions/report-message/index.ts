import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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

    const emailBody = `
      To: manebl@maneblod.com
      From: manebl@maneblod.com
      Subject: Reported Message from Openera
      Content-Type: text/html; charset=utf-8

      <p>A message has been reported:</p>
      <p>${message}</p>
    `.trim();

    const conn = await Deno.connect({ hostname: "mail.maneblod.com", port: 465 });
    const tlsConn = await Deno.startTls(conn, { hostname: "mail.maneblod.com" });

    // SMTP handshake
    await readResponse(tlsConn); // Read greeting
    await writeCommand(tlsConn, "EHLO mail.maneblod.com\r\n");
    await readResponse(tlsConn);
    
    // Authentication
    await writeCommand(tlsConn, "AUTH LOGIN\r\n");
    await readResponse(tlsConn);
    await writeCommand(tlsConn, btoa("manebl@maneblod.com") + "\r\n");
    await readResponse(tlsConn);
    await writeCommand(tlsConn, btoa(smtpPassword) + "\r\n");
    await readResponse(tlsConn);

    // Send email
    await writeCommand(tlsConn, "MAIL FROM:<manebl@maneblod.com>\r\n");
    await readResponse(tlsConn);
    await writeCommand(tlsConn, "RCPT TO:<manebl@maneblod.com>\r\n");
    await readResponse(tlsConn);
    await writeCommand(tlsConn, "DATA\r\n");
    await readResponse(tlsConn);
    await writeCommand(tlsConn, emailBody + "\r\n.\r\n");
    await readResponse(tlsConn);
    await writeCommand(tlsConn, "QUIT\r\n");

    tlsConn.close();
    console.log("Email sent successfully");

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

// Helper functions for SMTP communication
async function readResponse(conn: Deno.TlsConn): Promise<string> {
  const buf = new Uint8Array(1024);
  const n = await conn.read(buf);
  if (n === null) throw new Error("Connection closed");
  const response = new TextDecoder().decode(buf.subarray(0, n));
  console.log("Server response:", response);
  return response;
}

async function writeCommand(conn: Deno.TlsConn, command: string): Promise<void> {
  const encoder = new TextEncoder();
  const written = await conn.write(encoder.encode(command));
  console.log("Sent command:", command.trim());
  if (written === null) throw new Error("Failed to write command");
}