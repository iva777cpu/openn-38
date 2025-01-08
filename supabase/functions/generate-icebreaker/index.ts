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
    
    const userTraits = Object.entries(answers)
      .filter(([key, value]: [string, any]) => {
        return key.startsWith('user') && value && 
               typeof value.value === 'string' && 
               value.value.trim().length > 0;
      })
      .reduce((acc, [key, value]) => ({
        ...acc,
        [key]: {
          ...value,
          value: value.value.trim()
        }
      }), {});

    const targetTraits = Object.entries(answers)
      .filter(([key, value]: [string, any]) => {
        return (key.startsWith('target') || ['zodiac', 'mbti', 'style', 'humor', 'loves', 'dislikes', 'hobbies', 'books', 'music'].includes(key)) && 
               value && 
               typeof value.value === 'string' && 
               value.value.trim().length > 0;
      })
      .reduce((acc, [key, value]) => ({
        ...acc,
        [key]: {
          ...value,
          value: value.value.trim(),
          temperature: key === 'zodiac' ? 0.3 : value.temperature
        }
      }), {});

    const situationInfo = Object.entries(answers)
      .filter(([key, value]: [string, any]) => {
        return ['situation', 'previousTopics'].includes(key) && 
               value && 
               typeof value.value === 'string' && 
               value.value.trim().length > 0;
      })
      .reduce((acc, [key, value]) => ({
        ...acc,
        [key]: {
          ...value,
          value: value.value.trim()
        }
      }), {});
    
    console.log('Filtered user traits:', JSON.stringify(userTraits, null, 2));
    console.log('Filtered target traits:', JSON.stringify(targetTraits, null, 2));
    console.log('Filtered situation info:', JSON.stringify(situationInfo, null, 2));

    if (Object.keys(targetTraits).length === 0 && Object.keys(userTraits).length === 0) {
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

    const contextString = `
ABOUT YOU (The person approaching):
${Object.entries(userTraits)
  .map(([key, value]: [string, any]) => 
    `${key} (temperature ${value.temperature || 0.5}): ${value.value}\nINSTRUCTION: Use temperature ${value.temperature || 0.5} for creativity when referencing this trait.`)
  .join('\n')}

ABOUT THEM (The person you're approaching):
${Object.entries(targetTraits)
  .map(([key, value]: [string, any]) => 
    `${key} (temperature ${value.temperature || 0.5}): ${value.value}\nINSTRUCTION: Use temperature ${value.temperature || 0.5} for creativity when referencing this trait.`)
  .join('\n')}

SITUATION:
${Object.entries(situationInfo)
  .map(([key, value]: [string, any]) => 
    `${key} (temperature ${value.temperature || 0.7}): ${value.value}\nINSTRUCTION: Use temperature ${value.temperature || 0.7} for creativity when referencing this context.`)
  .join('\n')}`;

    console.log('Final context string being sent to OpenAI:', contextString);

    const systemPrompt = `You are a charming conversation expert. Generate numbered, engaging icebreakers that are clever, witty, and fun with refined sentences and flair. Mix formats and types with equal probability, such as:

Teasing or playful banter (if appropriate)
Shared experiences or hypotheticals
Fun facts or bold statements
Other creative options
Focus on charm, elegance, humor, and clever phrasing. Use contrasts for dramatic effect, playful twists, or poetic phrasing where possible. Keep everything friendly and sophisticated, ensuring humor is used appropriately. Avoid generating too many questions. If referencing anything that may need context (e.g., books, jokes, mythology, historical events, celebrities, mythological creatures, scientific facts, riddles, fun facts, wordplay, deities, or cultural references, etc.), assume the user doesn't know the context and add a brief explanation in parentheses (max 15 words). Ensure each icebreaker length is less than 40 words.

CRITICAL GUIDELINES:
- Use mostly information from the context below
- Return exactly 10 responses, numbered 1-10
- No introductory text or emojis
- NEVER ask the person to:
  - Tell a story
  - Share a joke
  - Give a pickup line
  - Share shopping preferences
  - Explain where they got something
- For each trait or piece of information, adjust your creativity based on the temperature value provided
- Higher temperatures (0.7-0.9) mean more creative and varied responses
- Lower temperatures (0.2-0.4) mean more focused and conservative responses
- For zodiac references specifically, keep it subtle and use temperature 0.3

Context (USE ONLY THIS INFORMATION):
${contextString}

Additional Context:
- First time approaching: ${isFirstTime ? 'Yes' : 'No'}
- Base creativity level: ${isFirstTime ? 'High (0.9)' : 'Moderate (0.4)'}`;

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
        temperature: 0.7, // Using a balanced base temperature
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