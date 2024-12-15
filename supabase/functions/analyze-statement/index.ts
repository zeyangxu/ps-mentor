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
      .single()

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

    // const difyResponse = await fetch("https://api.dify.ai/v1/workflows/run", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //     Authorization: `Bearer app-zNUj8dFNmGhyWgQHJOkPuqUs`,
    //   },
    //   body: JSON.stringify({
    //     inputs: {
    //       personal_statement: content,
    //     },
    //     response_mode: "blocking",
    //     user: "test",
    //   }),
    // });

    const difyResponse = {
      ok: true,
      status: 200,
      statusText: '',
      json: () => {
        return {
          data: {
            outputs: {
              text: '1. **Final Score**: 2 out of 60\n\n2. **Category**: Below Average\n\n3. **Advice for Improvement**:\n   - **Purpose and Motivation**: Begin by identifying a pivotal experience or passion that has driven your interest in the field you wish to study. This could be an academic project, a personal encounter, or an inspiring professional experience. Describe this moment vividly and explain how it has shaped your academic and career aspirations.\n   \n   - **Academic Competence**: Highlight relevant coursework, projects, or academic achievements that have prepared you for the program you are applying to. Discuss specific theories or methodologies you have encountered and their impact on your understanding of the subject.\n\n   - **Professional or Internship Competence**: If applicable, detail any internships or professional experiences related to your field of interest. Describe your role, responsibilities, challenges faced, and skills acquired. Reflect on how these experiences have equipped you with practical insights and competencies.\n\n   - **Program-specific Reasons**: Conduct thorough research on the program you are applying to. Mention specific courses, faculty members, or features of the program that align with your interests and goals. Explain why these elements are particularly appealing to you.\n\n   - **Future Career Planning**: Clearly outline your career objectives post-graduation. Specify the industry and roles you aim to pursue, detailing both short-term and long-term goals. Discuss how the knowledge and skills gained from the program will help achieve these goals and contribute to your desired impact in the field.\n\n   - **Quality of Writing**: Expand your statement into a coherent narrative that covers multiple paragraphs. Ensure clarity in expression, adherence to grammatical norms, and authenticity in using advanced vocabulary. Strive for a consistent style that effectively communicates your enthusiasm and qualifications.\n\n4. **Good Luck**: With dedication to revising and enriching your personal statement based on this feedback, I am confident you can present a compelling case for your application. Best of luck in crafting a narrative that truly reflects your potential!'
            }
          }
        }
      }
    }

    console.log("Edge Function: Dify response:", JSON.stringify(difyResponse));

    if (!difyResponse.ok) {
      throw new Error(
        `Dify API error: ${difyResponse.status} ${difyResponse.statusText}`,
      );
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