import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { userProfile, temperature = 0.7 } = await req.json()
    
    const prompt = `Given the following information about two people, generate 3 engaging ice breakers:
    Person 1: ${userProfile.userAge} years old, identifies as ${userProfile.userGender}
    Person 2: ${userProfile.targetAge} years old, identifies as ${userProfile.targetGender}
    
    Generate natural, friendly conversation starters that consider their ages and identities.`

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: 'You are a helpful assistant that generates engaging ice breakers for people to start conversations.' },
          { role: 'user', content: prompt }
        ],
        temperature: temperature,
      }),
    })

    const data = await response.json()
    return new Response(JSON.stringify({ icebreakers: data.choices[0].message.content }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})