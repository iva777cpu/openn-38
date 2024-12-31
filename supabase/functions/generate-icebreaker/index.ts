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

    const genAI = new GoogleGenerativeAI(Deno.env.get('GEMINI_API_KEY') || '')
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

    const systemPrompt = `You are a charming conversation expert. Generate 3 engaging, numbered icebreakers that are clever, charming, witty, and fun. Mix different types of icebreakers with equal probability, such as:
- Teasing or banter (if appropriate)
- Experiences or hypotheticals
- Fun facts or statements
- Playful questions that invite storytelling
- Interesting observations or compliments
- Other creative formats

Focus on the target's interests and experiences, keeping everything casual, friendly, and brief. Use humor appropriately and avoid generating too many questions, instead rely on other icebreaker formats. Each icebreaker must be under 25 words, and if referencing specific content (books, a poem, mythology, famous figures, etc.), include a brief explanation (max 15 words) in parentheses. Return exactly 3 responses. No introductory text or emojis.

Context about the interaction:
${Object.entries(answers)
  .map(([key, value]: [string, any]) => `${key}: ${value.value}`)
  .join('\n')}`

    console.log('Final prompt:', systemPrompt)

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
    
    return new Response(
      JSON.stringify({ 
        error: 'Failed to generate icebreakers',
        details: error.message 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})