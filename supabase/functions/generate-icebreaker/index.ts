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

    // Filter out empty fields and undefined values
    const filteredAnswers = Object.entries(answers).reduce((acc, [key, value]: [string, any]) => {
      if (value?.value && value.value.toString().trim() !== '') {
        return {
          ...acc,
          [key]: value
        };
      }
      return acc;
    }, {});
    
    console.log('Filtered answers:', JSON.stringify(filteredAnswers, null, 2));

    const userTraits = Object.entries(filteredAnswers)
      .filter(([key]: [string, any]) => key.startsWith('user'))
      .reduce((acc, [key, value]: [string, any]) => ({
        ...acc,
        [key]: value
      }), {});

    const targetTraits = Object.entries(filteredAnswers)
      .filter(([key]: [string, any]) => 
        key.startsWith('target') || 
        ['zodiac', 'mbti', 'style', 'humor', 'loves', 'dislikes', 'hobbies', 'books', 'music', 'mood'].includes(key)
      )
      .reduce((acc, [key, value]: [string, any]) => ({
        ...acc,
        [key]: value
      }), {});

    const situationInfo = Object.entries(filteredAnswers)
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
    `${value.questionText} (priority ${value.priority}): ${value.value}`)
  .join('\n')}

THEIR TRAITS (The person you're approaching):
${Object.entries(targetTraits)
  .map(([key, value]: [string, any]) => 
    `${value.questionText} (priority ${value.priority}): ${value.value}`)
  .join('\n')}

SITUATION:
${Object.entries(situationInfo)
  .map(([key, value]: [string, any]) => 
    `${value.questionText} (priority ${value.priority}): ${value.value}`)
  .join('\n')}`;

    console.log('Final context string being sent to OpenAI:', contextString);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4-turbo',
        messages: [
          { 
            role: 'system', 
            content: `You are a charming conversation expert. Generate numbered, engaging icebreakers that are clever, witty, and fun with refined sentences and flair. Mix formats and types with equal probability, such as:

Teasing or playful banter
Fun facts, bold statements and quotes
Other creative options

STRICT RULES FOR QUESTIONS:
- You are ONLY allowed to generate a MAXIMUM of 5 responses that contain questions
- Any response containing a question mark (?) counts as a question
- The remaining responses MUST be statements, observations, or other non-question formats

Focus on charm, elegance, humor, and clever phrasing. Use contrasts for dramatic effect, playful twists, or poetic phrasing where possible. Keep everything friendly and sophisticated, ensuring humor is used appropriately. when referencing anything specific such as (e.g., music, songs, poems, movies, quotes, TV shows, books, jokes, mythology, historical events, celebrities, mythological creatures, scientific facts, riddles, fun facts, wordplay, deities, or cultural references, etc.), assume the user doesn't know the reference and add a brief explanation in parentheses (max 15 words). Ensure each icebreaker length is less than 40 words.

CRITICAL GUIDELINES:
- Use ONLY information from the context below as inspiration but don't be restricted by them
- you must generate 3 general icebreakers that don't contain the context or aren't related to the context directly
- Return exactly 10 responses, numbered 1-10
- No introductory text or emojis
- Use ONLY the provided context as inspiration, DO NOT mix in themes or traits from previous conversations
- NEVER prompt the person to:
  - Tell a story
  - Share a joke
  - Give a pickup line
  - Share shopping preferences
  - Explain where they got something
- For each trait or piece of information, use the priority value to determine how much they should affect your responses (Priority levels guide how much emphasis to give traits), the higher the priority the more it should affect your responses.

IMPORTANT DISTINCTION:
- When using "YOUR TRAITS", these are traits of the person initiating the conversation (you)
- When using "THEIR TRAITS", these are traits of the person being approached (them)
- Make sure to maintain this distinction in your responses`
          },
          { 
            role: 'user', 
            content: `Context (USE ONLY INFORMATION as inspiration):
${contextString}

Additional Context:
- First time conversation: ${isFirstTime ? 'Yes - this is the first time they speak, focus on initial icebreakers' : 'No - They have talked before, at least once'}`
          }
        ],
        temperature: 0.6,
        max_tokens: 1000,
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