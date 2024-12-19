// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";

console.log("Edge Function: Starting execution");

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
    console.log("Edge Function: Received request");

    const { content } = await req.json();
    if (!content) {
      throw new Error("No content provided");
    }
    console.log("Edge Function: Content length received:", content?.length);

    const authHeader = req.headers.get("Authorization")!;
    console.log("Edge Function: Auth header present:", !!authHeader);

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: authHeader } } },
    );

    // Get the session or user object
    const token = authHeader.replace("Bearer ", "");
    const { data: userData } = await supabaseClient.auth.getUser(token);
    const user = userData.user;
    
    if (!user) {
      throw new Error("User not authenticated");
    }

    console.log("Edge Function: User authenticated:", JSON.stringify(user));

    // Check usage limit - First try to get existing record
    let { data: usageData, error: usageError } = await supabaseClient
      .from('usage_tracking')
      .select()
      .eq('user_id', user.id)
      .single();

    console.log("Usage data:", usageData, "Error:", usageError);

    // If no record exists, create one with count 0
    if (usageError && usageError.code === 'PGRST116') {
      const { data: newUsageData, error: insertError } = await supabaseClient
        .from('usage_tracking')
        .insert({ user_id: user.id, usage_count: 3 })
        .select()
        .single();

      if (insertError) {
        console.error("Error creating usage record:", insertError);
        throw new Error("Failed to initialize usage tracking");
      }

      usageData = newUsageData;
    } else if (usageError) {
      console.error("Usage check error:", usageError);
      throw new Error("Failed to check usage limit");
    }

    const currentUsage = usageData?.usage_count || 0;
    console.log("Edge Function: Usage checking:", currentUsage);
    if (currentUsage <= 0) {
      return new Response(
        JSON.stringify({
          error: "Usage limit exceeded",
          message: "You have reached your maximum number of analyses",
        }),
        {
          status: 403,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    // Format the content for Dify API
    const difyPayload = {
      inputs: {
        personal_statement: content,
      },
      response_mode: "blocking",
      user: user.id,
    };

    console.log("Sending request to Dify with payload:", JSON.stringify(difyPayload));

    const difyResponse = await fetch("https://api.dify.ai/v1/workflows/run", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer app-zNUj8dFNmGhyWgQHJOkPuqUs`,
      },
      body: JSON.stringify(difyPayload),
    });

    if (!difyResponse.ok) {
      const errorText = await difyResponse.text();
      console.error("Dify API error response:", errorText);
      throw new Error(`Dify API error: ${difyResponse.status} ${difyResponse.statusText}\nResponse: ${errorText}`);
    }

    const difyData = await difyResponse.json();
    console.log("Edge Function: Dify API response:", difyData);

    if (
      !difyData ||
      !difyData.data ||
      !difyData.data.outputs ||
      !difyData.data.outputs.text
    ) {
      throw new Error("Invalid response format from Dify API");
    }

    // Increment usage count after successful analysis
    const { error: updateError } = await supabaseClient
      .from('usage_tracking')
      .update({ usage_count: currentUsage - 1 })
      .eq('user_id', user.id);

    if (updateError) {
      console.error("Usage update error:", updateError);
      throw new Error("Failed to update usage count");
    }

    const data = {
      analysis: difyData.data.outputs.text,
    };

    console.log("Edge Function: Sending successful response");
    return new Response(JSON.stringify(data), {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });
  } catch (err) {
    console.error("Edge Function Error:", err);

    return new Response(
      JSON.stringify({
        message: err.message,
        details: err.stack,
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
        status: 500,
      },
    );
  }
});