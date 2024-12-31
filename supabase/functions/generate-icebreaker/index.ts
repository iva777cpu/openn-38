import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { GoogleGenerativeAI } from "https://esm.sh/@google/generative-ai@0.1.3"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { answers, temperature, isFirstTime } = await req.json()
    console.log('Received request with answers:', answers)

    // Sanitize inputs to ensure they're more casual and friendly
    const sanitizedAnswers = Object.entries(answers).reduce((acc, [key, value]: [string, any]) => {
      let sanitizedValue = value.value;
      
      // Convert potentially problematic terms to more casual alternatives
      if (key === 'mood' || key === 'targetPersonality') {
        const moodMap: Record<string, string> = {
          'cocky': 'confident',
          'dark': 'mysterious',
          'aggressive': 'assertive',
          'bitter': 'reserved',
        }
        sanitizedValue = moodMap[value.value.toLowerCase()] || value.value
      }
      
      return {
        ...acc,
        [key]: {
          ...value,
          value: sanitizedValue
        }
      }
    }, {})

    const genAI = new GoogleGenerativeAI(Deno.env.get('GEMINI_API_KEY') || '')
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

    const systemPrompt = `You are a friendly conversation starter helping create engaging icebreakers. Generate 3 casual, light-hearted numbered conversation starters that are clever and fun. Include:

- Playful questions that invite storytelling
- Interesting observations or gentle compliments
- Fun hypotheticals or shared experiences
- Light cultural references when relevant

Keep everything casual and friendly. Each response should be under 25 words. If referencing specific content, add a brief, friendly explanation (max 15 words) in parentheses.

Context about the interaction:
${Object.entries(sanitizedAnswers)
  .map(([key, value]: [string, any]) => `${key}: ${value.value}`)
  .join('\n')}`

    console.log('Using sanitized prompt:', systemPrompt)

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: systemPrompt }] }],
      generationConfig: {
        temperature: isFirstTime ? 0.9 : 0.5,
        topK: 40,
        topP: 0.95,
      },
    })
    
    const response = await result.response
    const text = response.text()
    
    console.log('Generated text:', text)

    const formattedText = text
      .split('\n')
      .filter(line => line.trim())
      .join('\n')

    if (!formattedText) {
      throw new Error('No valid text generated')
    }

    return new Response(
      JSON.stringify({ icebreakers: formattedText }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error in generate-icebreaker function:', error)
    
    // Provide more specific error message for safety filters
    const errorMessage = error.message.includes('SAFETY') 
      ? "Let's try again with different wording! The AI prefers keeping things light and friendly."
      : 'Failed to generate icebreakers'
    
    return new Response(
      JSON.stringify({ 
        error: errorMessage,
        details: error.message 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})