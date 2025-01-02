import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { GoogleGenerativeAI } from "https://esm.sh/@google/generative-ai@0.1.3";

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
    const { answers, temperature, isFirstTime } = await req.json();
    
    // Strictly filter out empty fields
    const filteredAnswers = Object.entries(answers)
      .filter(([_, value]: [string, any]) => {
        // Check if value exists and has a non-empty value property
        return value && 
               value.value && 
               typeof value.value === 'string' && 
               value.value.trim() !== '';
      })
      .reduce((acc, [key, value]) => ({
        ...acc,
        [key]: value
      }), {});
    
    console.log('Received request with strictly filtered answers:', filteredAnswers);

    // Check if there are any non-empty fields
    if (Object.keys(filteredAnswers).length === 0) {
      return new Response(
        JSON.stringify({ 
          error: 'No valid input provided',
          details: 'All fields are empty or contain only whitespace'
        }),
        { 
          status: 400,
          headers: { 
            ...corsHeaders,
            'Content-Type': 'application/json'
          }
        }
      );
    }

    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
    if (!geminiApiKey) {
      throw new Error('Gemini API key not configured');
    }

    const genAI = new GoogleGenerativeAI(geminiApiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    // Build context only from non-empty fields
    const contextString = Object.entries(filteredAnswers)
      .map(([key, value]: [string, any]) => `${key}: ${value.value}`)
      .join('\n');

    console.log('Using context string:', contextString);

    const systemPrompt = `You are a charming conversation expert. Generate 3 engaging, numbered icebreakers that are clever, charming, witty, and fun. Mix different types of icebreakers with equal probability, such as:
- Teasing or playful banter (if appropriate for the relationship)
- Shared experiences or hypothetical scenarios
- Fun facts or interesting statements
- Playful observations or genuine compliments
- Creative metaphors or analogies
- References to their interests (with brief explanations if needed)

Guidelines:
- Focus ONLY on their current interests and experiences from the context provided
- Keep everything casual, friendly, and brief
- Use humor appropriately for the relationship type
- Generate NO MORE than ONE question-based icebreaker
- Each icebreaker must be under 25 words
- If referencing specific content (books, mythology, etc.), include a brief explanation (max 15 words) in parentheses
- Return exactly 3 responses, numbered 1-3
- No introductory text or emojis

Context about the interaction:
${contextString}`;

    console.log('Using prompt:', systemPrompt);

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: systemPrompt }] }],
      generationConfig: {
        temperature: isFirstTime ? 0.9 : 0.5,
        topK: 40,
        topP: 0.95,
      },
    });
    
    const response = await result.response;
    const text = response.text();
    
    console.log('Generated icebreakers:', text);

    const formattedText = text
      .split('\n')
      .filter(line => line.trim())
      .join('\n');

    if (!formattedText) {
      throw new Error('No valid text generated');
    }

    return new Response(
      JSON.stringify({ icebreakers: formattedText }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in generate-icebreaker function:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Failed to generate icebreakers',
        details: error.message 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});