import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const geminiApiKey = Deno.env.get('GEMINI_API_KEY');

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
    
    if (!geminiApiKey) {
      throw new Error('GEMINI_API_KEY is not set');
    }

    // Create context from filled answers and their prompts
    const context = Object.entries(answers)
      .map(([key, data]: [string, any]) => `${key}: ${data.value} (${data.prompt})`)
      .join('\n');

    const systemPrompt = `You are a helpful assistant that generates conversation ice breakers. Your task is to generate exactly 3 ice breakers based on the provided context about both the speaker and the target person.

Important guidelines:
- Mix between these formats:
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
- Consider both the speaker's traits and the target's characteristics
${isFirstTime ? '- These should be suitable for a first-time conversation icebreaker, so keep it approachable' : ''}

Here is the context about both people:
${context}`;

    console.log('Sending prompt to Gemini:', systemPrompt);

    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': geminiApiKey,
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: systemPrompt
          }]
        }],
        generationConfig: {
          temperature: isFirstTime ? 0.9 : 0.7,
          maxOutputTokens: 300,
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Gemini API error response:', errorData);
      
      throw new Error(`Gemini API error: ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    console.log('Gemini response:', data);

    if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
      console.error('Unexpected Gemini response structure:', data);
      throw new Error('Invalid response structure from Gemini API');
    }

    const generatedText = data.candidates[0].content.parts[0].text;

    return new Response(
      JSON.stringify({ 
        icebreakers: generatedText 
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