import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { message, explanation } = await req.json();
    console.log("Received message to report:", message);
    console.log("Explanation:", explanation);

    const authHeader = req.headers.get('Authorization');
    let userId = null;

    if (authHeader) {
      const { data: { user }, error: userError } = await supabaseClient.auth.getUser(
        authHeader.replace('Bearer ', '')
      );

      if (!userError && user) {
        userId = user.id;
      }
    }

    const { data, error } = await supabaseClient
      .from('reported_messages')
      .insert([
        {
          message_text: message,
          reported_by: userId,
          status: 'pending',
          explanation: explanation
        }
      ]);

    if (error) {
      console.error("Error inserting report:", error);
      throw error;
    }

    console.log("Successfully stored report:", data);

    return new Response(
      JSON.stringify({ message: "Report stored successfully" }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error in report-message function:", error);
    
    return new Response(
      JSON.stringify({ 
        error: "Failed to store report",
        details: error.message
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});