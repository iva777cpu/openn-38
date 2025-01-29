import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { user_id } = await req.json()
    
    if (!user_id) {
      return new Response(
        JSON.stringify({ error: 'User ID is required' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      )
    }

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // Delete user data from tables in a specific order to handle foreign key constraints
    const tables = [
      'saved_messages',
      'user_generations',
      'explanation_usage',
      'user_preferences',
      'user_profiles',
      'reported_messages'
    ]

    for (const table of tables) {
      const { error } = await supabaseAdmin
        .from(table)
        .delete()
        .eq('user_id', user_id)

      if (error) {
        console.error(`Error deleting from ${table}:`, error)
        // Continue with other tables even if one fails
      }
    }

    // Finally delete the user from auth.users
    const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(
      user_id
    )

    if (deleteError) {
      throw new Error(`Failed to delete user: ${deleteError.message}`)
    }

    return new Response(
      JSON.stringify({ message: 'Account successfully deleted' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Delete account error:', error)
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Internal server error',
        details: error instanceof Error ? error.stack : undefined
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})