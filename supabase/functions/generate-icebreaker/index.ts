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

Teasing or playful banter
Fun facts, bold statements, hypotheticals and quotes
Other creative options

Focus on charm, elegance, humor, and clever phrasing. Use contrasts for dramatic effect, playful twists, or poetic phrasing where possible. Keep everything friendly and sophisticated, ensuring humor is used appropriately. when referencing anything such as (e.g., music, songs, poems, movies, quotes, TV shows, books, jokes, mythology, historical events, celebrities, mythological creatures, scientific facts, riddles, fun facts, wordplay, deities, or cultural references, etc.), assume the user doesn't know the refrence and add a brief explanation in parentheses (max 15 words). Ensure each icebreaker length is less than 40 words.

CRITICAL GUIDELINES:
- Use the provided context as inspiration but don't feel constrained by it
- At least 4 responses should directly reference the context information
- The remaining responses should be creative and engaging while keeping the context in mind
- You must return exactly 10 responses, numbered 1-10
- No introductory text or emojis
- Include NO MORE THAN 4 questions in your responses
- NEVER ask the person to:
  - Tell a story
  - Share a joke
  - Give a pickup line
  - Share shopping preferences
  - Explain where they got something
- Priority levels guide how much emphasis to give traits:
  - High (0.6-0.9): Use these traits for subtle guidance of 5 responses max
  - Medium (0.4-0.5): Use these traits for subtle guidance of 4 responses max
  - Low (0.2-0.3): Use these traits subtly or as background of 2 responses max
- Conversation Context: ${isFirstTime ? 'This is a first-time conversation, focus on initial ice-breaking' : 'These people have talked at least once before'}

IMPORTANT DISTINCTION:
- When using "YOUR TRAITS", these are traits of the person initiating the conversation (you)
- When using "THEIR TRAITS", these are traits of the person being approached (them)
- Make sure to maintain this distinction in your responses

Context (USE AS INSPIRATION):
${contextString}`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
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
