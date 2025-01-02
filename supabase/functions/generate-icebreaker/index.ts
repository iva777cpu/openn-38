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
    
    console.log('Raw request received:', {
      isFirstTime,
      temperature,
      totalFields: Object.keys(answers).length
    });
    console.log('Raw answers received:', JSON.stringify(answers, null, 2));
    
    // Strictly filter out empty fields and ensure values are strings
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
          value: value.value.trim() // Ensure no whitespace
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

    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
    if (!geminiApiKey) {
      throw new Error('Gemini API key not configured');
    }

    const genAI = new GoogleGenerativeAI(geminiApiKey);
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-pro',
      generationConfig: {
        temperature: isFirstTime ? 0.5 : 0.3,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 200,
      },
    });

    // Build context only from filtered fields
    const contextString = Object.entries(filteredAnswers)
      .map(([key, value]: [string, any]) => `${key}: ${value.value}`)
      .join('\n');

    console.log('Final context string being sent to AI:', contextString);

    const systemPrompt = `CRITICAL: You are a conversation expert generating EXACTLY 3 icebreakers based ONLY on the context below. 
DO NOT reference ANY information not explicitly provided in the context.

Guidelines:
- Use ONLY information from the context below
- NO assumptions about interests, hobbies, or topics not mentioned
- Keep responses casual, friendly, and brief
- Each icebreaker must be under 25 words
- Return exactly 3 responses, numbered 1-3
- No introductory text or emojis

Context (USE ONLY THIS INFORMATION):
${contextString}`;

    console.log('Full prompt being sent to AI:', systemPrompt);

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: systemPrompt }] }],
      generationConfig: {
        temperature: isFirstTime ? 0.5 : 0.3,
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
    
    // Enhanced error handling for safety blocks
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