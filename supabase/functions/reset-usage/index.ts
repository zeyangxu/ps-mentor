import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";

console.log("Reset Usage Edge Function: Starting execution");

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers":
          "authorization, x-client-info, apikey, content-type",
        "Access-Control-Max-Age": "86400",
      },
    });
  }

  try {
    console.log("Reset Usage Edge Function: Processing request");

    // Verify this is a scheduled request
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("No authorization header");
    }

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "", // Using service role key for admin access
    );

    // Reset all users' usage count to 3
    const { error } = await supabaseClient
      .from('usage_tracking')
      .update({ usage_count: 3 })
      .not('user_id', 'is', null);

    if (error) {
      console.error("Reset usage error:", error);
      throw new Error("Failed to reset usage counts");
    }

    console.log("Reset Usage Edge Function: Successfully reset usage counts");

    return new Response(
      JSON.stringify({ message: "Usage counts reset successfully" }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );

  } catch (err) {
    console.error("Reset Usage Edge Function Error:", err);

    return new Response(
      JSON.stringify({
        error: err.message,
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
        status: 500,
      }
    );
  }
}); 