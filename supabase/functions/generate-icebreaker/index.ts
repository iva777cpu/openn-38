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
    const { answers, isFirstTime } = await req.json();
    const cohereApiKey = Deno.env.get('COHERE_API_KEY');
    
    if (!cohereApiKey) {
      throw new Error('COHERE_API_KEY is not set');
    }

    // Create context from filled answers and their prompts
    const context = Object.entries(answers)
      .map(([key, data]: [string, any]) => `${key}: ${data.value} (${data.prompt})`)
      .join('\n');

    const prompt = `Generate 3 ${isFirstTime ? 'first-time conversation' : ''} ice breakers based on this context:
    ${context}
    
    Important guidelines:
    - Mix between these formats with their specific tones:
      * Casual questions
      * Fun facts or observations
      * Light-hearted statements
      * Friendly banter when appropriate
      * Be charming and charismatic
      * Add a subtle touch of dark humor when appropriate
    - Keep responses under 30 words each
    - Be natural and conversational
    - Return exactly 3 ice breakers, numbered 1-3
    - No introductory text or explanations
    - No exclamation marks or emojis
    - Consider both the speaker's traits (About You) and the target's characteristics (About Them)
    - Consider the General Information provided
    ${isFirstTime ? '- These should be suitable for a first-time conversation icebreaker, so keep it approachable' : ''}`;

    console.log('Sending prompt to Cohere:', prompt);

    const response = await fetch('https://api.cohere.ai/v1/generate', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${cohereApiKey}`,
        'Content-Type': 'application/json',
        'Cohere-Version': '2022-12-06'
      },
      body: JSON.stringify({
        model: 'command',
        prompt: prompt,
        max_tokens: 300,
        temperature: isFirstTime ? 0.9 : 0.7,
        k: 0,
        stop_sequences: [],
        return_likelihoods: 'NONE'
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Cohere API error:', errorData);
      throw new Error(`Cohere API error: ${errorData.message || 'Unknown error'}`);
    }

    const data = await response.json();
    console.log('Cohere response:', data);

    return new Response(
      JSON.stringify({ 
        icebreakers: data.generations[0].text 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  } catch (error) {
    console.error('Error in generate-icebreaker function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'An unexpected error occurred',
        details: error.toString()
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});