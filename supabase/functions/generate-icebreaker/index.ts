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

    // Separate user and target traits
    const userTraits = Object.entries(filteredAnswers)
      .filter(([key]) => key.startsWith('user'))
      .map(([key, value]: [string, any]) => 
        `${key}: ${value.value} (temperature: ${value.temperature})`
      ).join('\n');

    const targetTraits = Object.entries(filteredAnswers)
      .filter(([key]) => 
        key.startsWith('target') || 
        ['situation', 'previousTopics', 'humor', 'personality', 'mood'].includes(key)
      )
      .map(([key, value]: [string, any]) => 
        `${key}: ${value.value} (temperature: ${value.temperature})`
      ).join('\n');

    console.log('Processed traits:', { userTraits, targetTraits });

    const systemPrompt = `You are a conversation expert generating EXACTLY 3 icebreakers based on the context below.
Use ONLY information explicitly provided in the context.

RULES:
- Use ONLY information from the context below
- NO assumptions about interests or topics not mentioned
- Keep responses casual and brief
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
- Focus on making statements that invite natural conversation
- Make genuine, observational comments that don't require much effort to respond to
- Match the target's personality traits appropriately
- Avoid overly personal or invasive comments
- Keep the tone appropriate for the situation
- Make statements that acknowledge their traits without requiring explanations

YOUR TRAITS (Use these to shape your speaking style):
${userTraits}

THEIR TRAITS (These determine the tone and content):
${targetTraits}

Remember: Create engaging conversation starters that match their personality while keeping interactions natural and comfortable.`;

    console.log('Sending prompt to AI:', systemPrompt);

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
    
    return new Response(
      JSON.stringify({ 
        error: 'Failed to generate icebreakers',
        details: 'Please try again with different input. If the issue persists, try adjusting some of your inputs.'
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});