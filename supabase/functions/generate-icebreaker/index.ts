import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { GoogleGenerativeAI } from "https://esm.sh/@google/generative-ai@0.1.3"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { answers, systemPrompt, temperature, isFirstTime } = await req.json()
    console.log('Received request with answers:', answers)
    console.log('System prompt:', systemPrompt)

    const genAI = new GoogleGenerativeAI(Deno.env.get('GEMINI_API_KEY') || '')
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-pro',
    })

    const safePrompt = `You are a charming conversation expert. Generate engaging ice breakers that are clever, charming, witty and fun.
Mix formats such as: Mix formats between different types of icebreakers with equal probability, such as:
- Teasing or banter (if appropriate)
- Playful questions that invite storytelling
- Interesting observations or compliments
- Shared experiences or hypotheticals
- Fun facts or statements
- other things...
dont generate too many questions
No introductory text or emojis.
Keep each icebreaker under 25 words. If referencing specific content (books, mythology, celebrities, etc), add brief explanation (max 15 words) in parentheses. so each of your responses can be a total of 40.
Return exactly 3 numbered responses.

Context about the interaction:
${Object.entries(answers)
  .map(([key, value]: [string, any]) => `${key}: ${value.value}`)
  .join('\n')}`

    console.log('Final prompt:', safePrompt)

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: safePrompt }] }],
      generationConfig: {
        temperature: isFirstTime ? 0.9 : 0.5,
        topK: 40,
        topP: 0.95,
      },
    })
    
    const response = await result.response
    const text = response.text()
    
    console.log('Generated text:', text)

    // Format the response to match expected structure
    const formattedText = text
      .split('\n')
      .filter(line => line.trim())
      .join('\n')

    if (!formattedText) {
      throw new Error('No valid text generated')
    }

    return new Response(
      JSON.stringify({
        icebreakers: formattedText
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  } catch (error) {
    console.error('Error in generate-icebreaker function:', error)
    
    // Provide more specific error messages
    let errorMessage = 'Failed to generate icebreakers'
    if (error.message?.includes('SAFETY')) {
      errorMessage = 'Please try again with different input. Keep the tone casual and friendly.'
    }
    
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