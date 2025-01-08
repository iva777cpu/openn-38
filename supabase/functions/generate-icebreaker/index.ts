import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import OpenAI from "https://esm.sh/openai@4.28.0";

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

    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    console.log('Initializing OpenAI client...');
    const openai = new OpenAI({
      apiKey: openaiApiKey,
    });

    const contextString = Object.entries(filteredAnswers)
      .map(([key, value]: [string, any]) => `${key}: ${value.value}`)
      .join('\n');

    console.log('Final context string being sent to AI:', contextString);

    const systemPrompt = `CRITICAL: You are a conversation expert generating EXACTLY 3 icebreakers based ONLY on the context below. 
DO NOT reference ANY information not explicitly provided in the context.
DO NOT ask the target to tell stories, jokes, or their preferences.

Guidelines:
- Use ONLY information from the context below
- NO assumptions about interests, hobbies, or topics not mentioned
- Keep responses casual, friendly, and brief
- Each icebreaker must be under 25 words
- Return exactly 3 responses, numbered 1-3
- No introductory text or emojis
- DO NOT ask questions that require the target to tell stories or jokes
- DO NOT ask about shopping preferences or favorites

Context (USE ONLY THIS INFORMATION):
${contextString}`;

    console.log('Full prompt being sent to AI:', systemPrompt);

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: systemPrompt }
      ],
      temperature: isFirstTime ? 0.5 : 0.3,
      max_tokens: 200,
      top_p: 0.95,
    });
    
    const text = completion.choices[0].message.content;
    console.log('Raw AI response:', text);

    if (!text) {
      throw new Error('No valid text generated');
    }

    const formattedText = text
      .split('\n')
      .filter(line => line.trim())
      .join('\n');

    return new Response(
      JSON.stringify({ icebreakers: formattedText }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in generate-icebreaker function:', error);
    
    const errorMessage = error.message.includes('SAFETY') 
      ? 'AI safety filters triggered. Please try again with different input.'
      : error.message;
    
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