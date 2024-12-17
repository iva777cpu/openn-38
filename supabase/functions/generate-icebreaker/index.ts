import "https://deno.land/x/xhr@0.1.0/mod.ts";
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
    const { userProfile, temperature } = await req.json();
    console.log('Received request with profile:', userProfile, 'and temperature:', temperature);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant that generates engaging and appropriate ice breakers based on user profiles.'
          },
          {
            role: 'user',
            content: `Generate 3 engaging ice breakers for:
              Person 1: ${userProfile.userAge} years old, identifies as ${userProfile.userGender}
              Person 2: ${userProfile.targetAge} years old, identifies as ${userProfile.targetGender}
              
              Make the ice breakers natural, friendly, and appropriate for their ages and identities.`
          }
        ],
        temperature: temperature,
      }),
    });

    const data = await response.json();
    console.log('OpenAI response:', data);

    return new Response(
      JSON.stringify({ 
        icebreakers: data.choices[0].message.content 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  } catch (error) {
    console.error('Error in generate-icebreaker function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});