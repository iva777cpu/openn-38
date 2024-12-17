import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { answers, isFirstTime } = await req.json();

    // Check if OPENAI_API_KEY is set
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OPENAI_API_KEY is not set');
    }

    // Create context from filled answers and their prompts
    const context = Object.entries(answers)
      .map(([key, data]: [string, any]) => `${key}: ${data.value} (${data.prompt})`)
      .join('\n');

    const prompt = `Generate 3 ${isFirstTime ? 'first-time conversation' : ''} ice breakers based on this context:
    ${context}
    
    Important guidelines:
    - Mix between these formats with their specific tones:
      * Casual questions (temperature: 0.5)
      * Fun facts or observations (temperature: 0.8)
      * Light-hearted statements (temperature: 0.5)
      * Friendly banter when appropriate (temperature: 0.8)
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

    console.log('Sending prompt to OpenAI:', prompt);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { 
            role: 'system', 
            content: 'You are a friendly conversation starter that mixes questions, statements, and fun facts to create engaging ice breakers.'
          },
          { role: 'user', content: prompt }
        ],
        temperature: isFirstTime ? 0.9 : 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
    }

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