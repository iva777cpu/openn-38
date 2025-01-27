import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Function to count questions in a string
const countQuestions = (text: string): number => {
  // Count question marks
  const questionMarks = (text.match(/\?/g) || []).length;
  
  // Count question words (what, why, how, when, where, who)
  const questionWords = (text.match(/\b(what|why|how|when|where|who)\b/gi) || []).length;
  
  // Return the maximum between question marks and question words
  return Math.max(questionMarks, questionWords);
};

// Function to process and filter responses
const processResponses = (text: string): string => {
  // Split into individual icebreakers
  const icebreakers = text.split(/\d+\./).filter(Boolean);
  
  // Process each icebreaker
  const processedIcebreakers = icebreakers.map((icebreaker, index) => {
    let processed = icebreaker.trim();
    const questionCount = countQuestions(processed);
    
    // If there are more than 2 questions, convert some to statements
    if (questionCount > 2) {
      // Replace question marks after the second one with periods
      let questionFound = 0;
      processed = processed.replace(/\?/g, (match) => {
        questionFound++;
        return questionFound <= 2 ? '?' : '.';
      });
      
      // Convert question words to statements after the second question
      const words = processed.split(' ');
      let questionsInSentence = 0;
      processed = words.map((word, i) => {
        if (/^(what|why|how|when|where|who)$/i.test(word)) {
          questionsInSentence++;
          if (questionsInSentence > 2) {
            // Convert question word to statement
            const conversions: { [key: string]: string } = {
              'what': 'that',
              'why': 'because',
              'how': 'the way',
              'when': 'then',
              'where': 'there',
              'who': 'someone'
            };
            return conversions[word.toLowerCase()] || word;
          }
        }
        return word;
      }).join(' ');
    }
    
    return `${index + 1}. ${processed}`;
  });

  return processedIcebreakers.join('\n\n');
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
        model: 'gpt-4o',
        messages: [
          { 
            role: 'system', 
            content: `You are a charming conversation expert. Generate numbered, engaging icebreakers that are clever, witty, and fun with refined sentences and flair. Mix formats and types with equal probability, such as:

Teasing or playful banter
Fun facts, bold statements and quotes
Other creative options

Focus on charm, elegance, humor, and clever phrasing. Use contrasts for dramatic effect, playful twists, or poetic phrasing where possible. Keep everything friendly and sophisticated, ensuring humor is used appropriately. when referencing anything specific such as (e.g., music, songs, poems, movies, quotes, TV shows, books, jokes, mythology, historical events, celebrities, mythological creatures, scientific facts, riddles, fun facts, wordplay, deities, or cultural references, etc.), assume the user doesn't know the refrence and add a brief explanation in parentheses (max 15 words). Ensure each icebreaker length is less than 40 words.

CRITICAL GUIDELINES:
- Use ONLY information from the context below
- DO NOT ask more than 2 questions
- Return exactly 10 responses, numbered 1-10
- No introductory text or emojis
- Use ONLY the provided context as inspiration, DO NOT mix in themes or traits from previous conversations
- Include NO MORE THAN 2 questions in your responses
- NEVER prompt the person to:
  - Tell a story
  - Share a joke
  - Give a pickup line
  - Share shopping preferences
  - Explain where they got something
- For each trait or piece of information, use the priority value to determine how much they should effect your responses (Priority levels guide how much emphasis to give traits):
  - High (0.6-0.9): mean these traits should be prominently featured for guidance of 4 responses max
  - Medium (0.4-0.5): mean these traits should be prominently featured for guidance of 2 responses max
  - Low (0.2-0.3): Use these traits subtly or as background for 1 responses max`
          },
          { 
            role: 'user', 
            content: `Context (USE ONLY THIS INFORMATION as inspiration):
${contextString}

Additional Context:
- First time conversation: ${isFirstTime ? 'Yes - this is the first time they speak, focus on initial icebreakers' : 'No - They have talked before, at least once'}`
          }
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('OpenAI API error:', error);
      throw new Error('Failed to generate icebreakers');
    }

    const data = await response.json();
    const rawIcebreakers = data.choices[0].message.content;
    
    // Process the responses to ensure max 2 questions
    const processedIcebreakers = processResponses(rawIcebreakers);
    
    console.log('Raw OpenAI response:', rawIcebreakers);
    console.log('Processed response:', processedIcebreakers);

    return new Response(
      JSON.stringify({ icebreakers: processedIcebreakers }),
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