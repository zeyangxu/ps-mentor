// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from 'jsr:@supabase/supabase-js@2'

console.log("Hello from Functions!")

Deno.serve(async (req) => {
  const { content } = await req.json()
  const authHeader = req.headers.get('Authorization')!
  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    { global: { headers: { Authorization: authHeader } } }
  )

  // Get the session or user object
  const token = authHeader.replace('Bearer ', '')
  const { data: userData } = await supabaseClient.auth.getUser(token)
  const user = userData.user

  try {
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

    const json = await res.json();

    console.log("🦄 ===", res, json)

    const data = {
      analysis: json.data.outputs.text
    }
  
    return new Response(
      JSON.stringify(data),
      { headers: { "Content-Type": "application/json" } },
    )
  } catch(err) {
    console.error(err)

    return new Response(
      JSON.stringify({message: err.message}),
      { headers: { "Content-Type": "application/json" } },
    )
  }

  
})

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/analyze-statement' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
