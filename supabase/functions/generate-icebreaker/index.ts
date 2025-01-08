import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { GoogleGenerativeAI } from "https://esm.sh/@google/generative-ai@0.1.3";

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
    
    console.log('Request details:', {
      isFirstTime,
      baseTemperature: temperature,
      totalFields: Object.keys(answers).length,
      answers
    });

    const filteredAnswers = Object.entries(answers)
      .filter(([_, value]: [string, any]) => {
        return value && 
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

    if (Object.keys(filteredAnswers).length === 0) {
      return new Response(
        JSON.stringify({ 
          error: 'No valid input provided'
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
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-pro',
      generationConfig: {
        temperature: isFirstTime ? 0.9 : 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 200,
      },
    });

    // Separate user and target traits with their temperatures
    const userTraits = Object.entries(filteredAnswers)
      .filter(([key]) => key.startsWith('user'))
      .map(([key, value]: [string, any]) => 
        `${key}: ${value.value} (temperature: ${value.temperature}, use this to adjust response style)`
      ).join('\n');

    const targetTraits = Object.entries(filteredAnswers)
      .filter(([key]) => 
        key.startsWith('target') || 
        ['situation', 'previousTopics', 'humor', 'personality', 'mood'].includes(key)
      )
      .map(([key, value]: [string, any]) => 
        `${key}: ${value.value} (temperature: ${value.temperature}, use this to match their traits)`
      ).join('\n');

    const systemPrompt = `CRITICAL: You are a conversation expert generating EXACTLY 3 icebreakers based ONLY on the context below. 
DO NOT reference ANY information not explicitly provided in the context.

IMPORTANT RULES:
- Use ONLY information from the context below
- NO assumptions about interests, hobbies, or topics not mentioned
- Keep responses casual, friendly, and brief
- Each icebreaker must be under 25 words
- Return exactly 3 responses, numbered 1-3
- No introductory text or emojis
- NEVER ask questions like:
  * "tell me more about..."
  * "what's your favorite..."
  * "where did you get..."
  * "tell me a story about..."
  * "do you have any jokes..."
  * "what kind of... do you like"
  * "what brings you here..."
  * "how do you feel about..."
- Focus on making statements or observations that invite natural conversation
- DO NOT ask the person to tell stories or jokes
- Make genuine, charming comments that don't require much effort to respond to
- CRITICAL: Match the target's personality and mood exactly - if they're dark or bitter, responses should reflect that
- DO NOT generate upbeat responses for someone with a dark/negative personality trait
- NEVER ask about shopping preferences or personal choices
- DO NOT ask for pickup lines or jokes
- Make statements that show understanding of their traits without requiring them to explain themselves

YOUR TRAITS (Use these to shape your speaking style):
${userTraits}

THEIR TRAITS (These determine the tone and content of icebreakers):
${targetTraits}

Remember: Create engaging icebreakers that match their exact personality and don't put pressure on them to respond with long answers.`;

    console.log('Full prompt being sent to AI:', systemPrompt);

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: systemPrompt }] }],
      generationConfig: {
        temperature: isFirstTime ? 0.9 : 0.7,
        topK: 40,
        topP: 0.95,
      },
    });
    
    const response = await result.response;
    const text = response.text();
    
    console.log('Raw AI response:', text);

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