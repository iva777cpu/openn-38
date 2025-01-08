import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { answers, temperature, isFirstTime } = await req.json();
    
    console.log('Raw request received:', {
      isFirstTime,
      temperature,
      totalFields: Object.keys(answers).length
    });
    console.log('Raw answers received:', JSON.stringify(answers, null, 2));
    
    const filteredAnswers = Object.entries(answers)
      .filter(([key, value]: [string, any]) => {
        const isValid = value && 
               typeof value.value === 'string' && 
               value.value.trim().length > 0;
        
        console.log(`Field ${key}: ${value?.value} - Valid: ${isValid}`);
        return isValid;
      })
      .reduce((acc, [key, value]) => ({
        ...acc,
        [key]: {
          ...value,
          value: value.value.trim()
        }
      }), {});
    
    console.log('Filtered answers to be sent to AI:', JSON.stringify(filteredAnswers, null, 2));

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

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const contextString = Object.entries(filteredAnswers)
      .map(([key, value]: [string, any]) => `${key}: ${value.value}`)
      .join('\n');

    console.log('Final context string being sent to OpenAI:', contextString);

    const systemPrompt = `You are a conversation expert generating EXACTLY 10 icebreakers based ONLY on the context below. 
DO NOT reference ANY information not explicitly provided in the context.

Guidelines:
- Use ONLY information from the context below
- NO assumptions about interests, hobbies, or topics not mentioned
- Keep responses casual, friendly, and brief
- Each icebreaker must be under 25 words
- Return exactly 10 responses, numbered 1-10
- No introductory text or emojis

Context (USE ONLY THIS INFORMATION):
${contextString}`;

    console.log('Full prompt being sent to OpenAI:', systemPrompt);

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
        temperature: isFirstTime ? 0.9 : 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('OpenAI API error:', error);
      throw new Error('Failed to generate icebreakers');
    }

    const data = await response.json();
    const icebreakers = data.choices[0].message.content;
    
    console.log('Raw OpenAI response:', icebreakers);

    return new Response(
      JSON.stringify({ icebreakers }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in generate-icebreaker function:', error);
    
    const errorMessage = error.message || 'Failed to generate icebreakers';
    
    return new Response(
      JSON.stringify({ 
        error: 'Failed to generate icebreakers',
        details: errorMessage 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});