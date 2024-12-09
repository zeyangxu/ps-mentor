// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from 'jsr:@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

console.log("Edge Function: Starting execution")

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
        'Access-Control-Max-Age': '86400',
      },
    })
  }

  try {
    console.log("Edge Function: Received request")
    
    const { content } = await req.json()
    console.log("Edge Function: Content length received:", content?.length)
    
    const authHeader = req.headers.get('Authorization')!
    console.log("Edge Function: Auth header present:", !!authHeader)
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    )

    // Get the session or user object
    const token = authHeader.replace('Bearer ', '')
    const { data: userData } = await supabaseClient.auth.getUser(token)
    const user = userData.user
    console.log("Edge Function: User authenticated:", !!user)

    const res = await fetch('https://api.dify.ai/v1/workflows/run', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer app-zNUj8dFNmGhyWgQHJOkPuqUs`
      },
      body: JSON.stringify({
        inputs: {
          personal_statement: content
        },
        response_mode: "blocking",
        user: "test"
      })
    })

    const json = await res.json()
    console.log("Edge Function: Dify API response received")

    const data = {
      analysis: json.data.outputs.text
    }
  
    console.log("Edge Function: Sending successful response")
    return new Response(
      JSON.stringify(data),
      { 
        headers: { 
          ...corsHeaders,
          "Content-Type": "application/json"
        } 
      },
    )
  } catch(err) {
    console.error("Edge Function Error:", err)

    return new Response(
      JSON.stringify({message: err.message}),
      { 
        headers: { 
          ...corsHeaders,
          "Content-Type": "application/json",
        },
        status: 500
      },
    )
  }
})