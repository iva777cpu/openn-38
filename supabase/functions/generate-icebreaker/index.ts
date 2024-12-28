import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const geminiApiKey = Deno.env.get('GEMINI_API_KEY');

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
    
    if (!geminiApiKey) {
      throw new Error('GEMINI_API_KEY is not set');
    }

    // Calculate average temperature from filled fields
    const temperatures = Object.values(answers)
      .map((data: any) => data.temperature)
      .filter((temp: number) => temp !== undefined);
    
    const avgTemperature = temperatures.length > 0
      ? temperatures.reduce((a: number, b: number) => a + b, 0) / temperatures.length
      : 0.7;

    // Create context only from filled answers
    const context = Object.entries(answers)
      .map(([key, data]: [string, any]) => `${key}: ${data.value} (${data.prompt})`)
      .join('\n');

    const systemPrompt = `You are a sophisticated and witty conversation assistant. Generate exactly 3 engaging ice breakers based on the provided context about both the speaker and the target person.

Key guidelines:
- Be charming and sophisticated, avoid clichés and cheesy lines
- Use wit and subtle humor when appropriate
- Show emotional intelligence and cultural awareness
- Keep responses concise (under 30 words each)
- Format as numbered list (1-3)
- Consider both personalities and dynamics
${isFirstTime ? '- Keep it approachable for first interactions' : ''}

Context about both people:
${context}`;

    console.log('Sending prompt to Gemini:', systemPrompt);
    console.log('Using calculated temperature:', avgTemperature);

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
          temperature: avgTemperature,
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