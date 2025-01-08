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
    const { answers, isFirstTime } = await req.json();
    
    console.log('Raw request received:', {
      isFirstTime,
      totalFields: Object.keys(answers).length,
      fields: Object.keys(answers)
    });
    
    console.log('Detailed answers received:', JSON.stringify(answers, null, 2));

    const userTraits = Object.entries(answers)
      .filter(([key]: [string, any]) => key.startsWith('user'))
      .reduce((acc, [key, value]: [string, any]) => ({
        ...acc,
        [key]: value
      }), {});

    const targetTraits = Object.entries(answers)
      .filter(([key]: [string, any]) => 
        key.startsWith('target') || 
        ['zodiac', 'mbti', 'style', 'humor', 'loves', 'dislikes', 'hobbies', 'books', 'music', 'mood'].includes(key)
      )
      .reduce((acc, [key, value]: [string, any]) => ({
        ...acc,
        [key]: value
      }), {});

    const situationInfo = Object.entries(answers)
      .filter(([key]: [string, any]) => ['situation', 'previousTopics'].includes(key))
      .reduce((acc, [key, value]: [string, any]) => ({
        ...acc,
        [key]: value
      }), {});

    console.log('Processed traits:', {
      userTraits: Object.keys(userTraits),
      targetTraits: Object.keys(targetTraits),
      situationInfo: Object.keys(situationInfo)
    });

    const contextString = `
YOUR TRAITS (The person initiating conversation):
${Object.entries(userTraits)
  .map(([key, value]: [string, any]) => 
    `${value.questionText} (priority ${value.priority}): ${value.value}\nINSTRUCTION: ${value.prompt || 'Consider this information'} with priority ${value.priority}.`)
  .join('\n')}

THEIR TRAITS (The person you're approaching):
${Object.entries(targetTraits)
  .map(([key, value]: [string, any]) => 
    `${value.questionText} (priority ${value.priority}): ${value.value}\nINSTRUCTION: ${value.prompt || 'Consider this information'} with priority ${value.priority}.`)
  .join('\n')}

SITUATION:
${Object.entries(situationInfo)
  .map(([key, value]: [string, any]) => 
    `${value.questionText} (priority ${value.priority}): ${value.value}\nINSTRUCTION: ${value.prompt || 'Consider this context'} with priority ${value.priority}.`)
  .join('\n')}`;

    console.log('Final context string being sent to OpenAI:', contextString);

    const systemPrompt = `You are a charming conversation expert. Generate numbered, engaging icebreakers that are clever, witty, and fun with refined sentences and flair. Mix formats and types with equal probability, such as:

Teasing or playful banter (if appropriate)
Shared experiences or hypotheticals
Fun facts or bold statements
Other creative options

Focus on charm, elegance, humor, and clever phrasing. Use contrasts for dramatic effect, playful twists, or poetic phrasing where possible. Keep everything friendly and sophisticated, ensuring humor is used appropriately. If referencing anything that may need context (e.g., books, jokes, mythology, historical events, celebrities, mythological creatures, scientific facts, riddles, fun facts, wordplay, deities, or cultural references, etc.), assume the user doesn't know the context and add a brief explanation in parentheses (max 15 words). Ensure each icebreaker length is less than 40 words.

CRITICAL GUIDELINES:
- Use mostly information from the context below
- Return exactly 10 responses, numbered 1-10
- No introductory text or emojis
- Include NO MORE THAN 4 questions in your responses
- NEVER ask the person to:
  - Tell a story
  - Share a joke
  - Give a pickup line
  - Share shopping preferences
  - Explain where they got something
- For each trait or piece of information, use the priority value to determine how much emphasis to give it
- Higher priorities (0.7-0.9) mean these traits should be prominently featured in responses
- Lower priorities (0.2-0.4) mean these traits should be referenced less frequently or subtly
- Base priority level: ${isFirstTime ? 'High (0.8)' : 'Low (0.4)'}

IMPORTANT DISTINCTION:
- When using "YOUR TRAITS", these are traits of the person initiating the conversation (you)
- When using "THEIR TRAITS", these are traits of the person being approached (them)
- Make sure to maintain this distinction in your responses

Context (USE ONLY THIS INFORMATION):
${contextString}

Additional Context:
- First time approaching: ${isFirstTime ? 'Yes' : 'No'}
- Base priority level: ${isFirstTime ? 'High (0.8)' : 'Low (0.4)'}`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: systemPrompt }
        ],
        temperature: 0.7,
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
