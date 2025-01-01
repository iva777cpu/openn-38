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
    const { answers, temperature, isFirstTime } = await req.json();
    console.log('Received request with answers:', answers);

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const systemPrompt = `You are a charming conversation expert. Generate 3 engaging, numbered icebreakers that are clever, charming, witty, and fun. Mix different types of icebreakers with equal probability, such as:
- Teasing or playful banter (if appropriate for the relationship)
- Shared experiences or hypothetical scenarios
- Fun facts or interesting statements
- Playful observations or genuine compliments
- Creative metaphors or analogies
- References to their interests (with brief explanations if needed)

Guidelines:
- Focus on their interests and experiences from the context
- Keep everything casual, friendly, and brief
- Use humor appropriately for the relationship type
- Generate NO MORE than ONE question-based icebreaker
- Each icebreaker must be under 25 words
- If referencing specific content (books, mythology, etc.), include a brief explanation (max 15 words) in parentheses
- Return exactly 3 responses, numbered 1-3
- No introductory text or emojis

Context about the interaction:
${Object.entries(answers)
  .map(([key, value]: [string, any]) => `${key}: ${value.value}`)
  .join('\n')}`;

    console.log('Using prompt:', systemPrompt);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt }
        ],
        temperature: isFirstTime ? 0.9 : 0.5,
        top_p: 0.95,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('OpenAI API error:', error);
      throw new Error('Failed to generate response from OpenAI');
    }

    const data = await response.json();
    const text = data.choices[0].message.content;
    
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