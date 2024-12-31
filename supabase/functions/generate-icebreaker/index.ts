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
    const { answers, systemPrompt, temperature } = await req.json()
    console.log('Received request with answers:', answers)
    console.log('System prompt:', systemPrompt)

    const genAI = new GoogleGenerativeAI(Deno.env.get('GEMINI_API_KEY') || '')
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-pro',
    })

    // Modify the prompt to be more casual and friendly
    const safePrompt = `You are a friendly conversation starter helping someone break the ice. 
Keep the tone light, casual, and appropriate for all audiences.

Your task is to generate 2 engaging conversation starters that are:
1. Fun and lighthearted
2. Appropriate for casual conversations
3. Focused on shared interests or experiences

Format: Return exactly 2 numbered responses, each under 20 words.

Context about the interaction:
${Object.entries(answers)
  .map(([key, value]: [string, any]) => `${key}: ${value.value}`)
  .join('\n')}

Remember to:
- Keep everything casual and friendly
- Avoid sensitive topics
- Focus on common interests and experiences
- Use humor appropriately
- Keep responses brief and engaging`

    console.log('Final prompt:', safePrompt)

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: safePrompt }] }],
      generationConfig: {
        temperature: Math.min(0.7, temperature), // Cap temperature to reduce risky outputs
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