import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { GoogleGenerativeAI } from "https://esm.sh/@google/generative-ai@0.1.3";

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
    const { answers, isFirstTime } = await req.json();
    
    console.log('Raw answers received:', JSON.stringify(answers, null, 2));
    
    // Strictly filter out empty fields
    const filteredAnswers = Object.entries(answers)
      .filter(([key, value]: [string, any]) => {
        const isValid = value && 
               value.value && 
               typeof value.value === 'string' && 
               value.value.trim() !== '';
        
        console.log(`Field ${key}: ${value?.value} - Valid: ${isValid}`);
        return isValid;
      })
      .reduce((acc, [key, value]) => ({
        ...acc,
        [key]: value
      }), {});
    
    console.log('Strictly filtered answers:', JSON.stringify(filteredAnswers, null, 2));

    // Check if there are any non-empty fields
    if (Object.keys(filteredAnswers).length === 0) {
      console.log('No valid fields found after filtering');
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

    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
    if (!geminiApiKey) {
      throw new Error('Gemini API key not configured');
    }

    const genAI = new GoogleGenerativeAI(geminiApiKey);
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-pro',
      generationConfig: {
        temperature: isFirstTime ? 0.7 : 0.5, // Reduced from 0.9 to 0.7 for safety
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 200,
      },
    });

    // Build context only from non-empty fields
    const contextString = Object.entries(filteredAnswers)
      .map(([key, value]: [string, any]) => `${key}: ${value.value}`)
      .join('\n');

    console.log('Final context string being sent to AI:', contextString);

    const systemPrompt = `IMPORTANT: Generate ONLY based on the context provided below. DO NOT reference any topics, interests, or information not explicitly provided in the context.

You are a friendly and respectful conversation expert. Generate 3 engaging, numbered icebreakers that are polite, appropriate, and fun. Mix different types of icebreakers with equal probability, such as:
- Light and friendly conversation starters
- Shared experiences or hypothetical scenarios
- Interesting observations or genuine compliments
- Creative and appropriate metaphors
- Safe and casual topics

Guidelines:
- Focus ONLY on information explicitly provided in the context below
- DO NOT reference any topics not mentioned in the context
- Keep everything casual, friendly, and appropriate
- Use light humor when suitable
- Generate NO MORE than ONE question-based icebreaker
- Each icebreaker must be under 25 words
- Return exactly 3 responses, numbered 1-3
- No introductory text or emojis
- Avoid any controversial, personal, or sensitive topics
- Keep all suggestions appropriate for a general audience

Context (USE ONLY THIS INFORMATION):
${contextString}`;

    console.log('Full prompt being sent to AI:', systemPrompt);

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: systemPrompt }] }],
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
    
    // Special handling for safety blocks
    if (error.message?.includes('SAFETY')) {
      return new Response(
        JSON.stringify({ 
          error: 'Content safety error',
          details: 'The AI model blocked the response for safety reasons. Please try again with different input.'
        }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }
    
    return new Response(
      JSON.stringify({ 
        error: 'Failed to generate icebreakers',
        details: error.message 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});