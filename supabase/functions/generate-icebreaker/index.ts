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
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

    const prompt = `${systemPrompt}\n\nContext about the interaction:\n${
      Object.entries(answers)
        .map(([key, value]: [string, any]) => `${key}: ${value.value} (${value.prompt})`)
        .join('\n')
    }`

    console.log('Final prompt:', prompt)

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()
    
    console.log('Generated text:', text)

    // Format the response to match expected structure
    const formattedText = text
      .split('\n')
      .filter(line => line.trim())
      .join('\n')

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