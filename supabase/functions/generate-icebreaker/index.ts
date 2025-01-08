import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

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
    const { answers } = await req.json();
    console.log('Received answers:', JSON.stringify(answers, null, 2));

    // Create a more focused prompt for the AI
    const prompt = `Generate 3 unique, natural conversation starters or icebreakers based on these traits:

User: ${answers.impression?.value || 'No specific impression'}
Target Person: 
- Personality: ${answers.targetPersonality?.value || 'Not specified'}
- Interests: ${answers.loves?.value || 'Not specified'}
- Humor: ${answers.humor?.value || 'Not specified'}

Context: ${answers.situation?.value || 'A casual conversation'}

Important:
- Keep responses brief and natural
- Focus on common interests and positive topics
- Avoid personal questions or sensitive topics
- Make each icebreaker unique and engaging
- Format as a numbered list (1., 2., 3.)`;

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
            content: 'You are a helpful assistant that generates natural, appropriate conversation starters. Keep responses concise and engaging.'
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    console.log('OpenAI response:', JSON.stringify(data, null, 2));

    if (!data.choices || !data.choices[0]?.message?.content) {
      throw new Error('Invalid response from OpenAI');
    }

    const icebreakers = data.choices[0].message.content
      .split('\n')
      .filter(line => line.trim().match(/^\d+\./))
      .map(line => line.replace(/^\d+\.\s*/, '').trim());

    if (icebreakers.length === 0) {
      throw new Error('No valid icebreakers generated');
    }

    console.log('Generated icebreakers:', icebreakers);

    return new Response(
      JSON.stringify({ icebreakers: icebreakers.join('\n') }),
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