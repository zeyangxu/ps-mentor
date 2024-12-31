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
      .from("usage_tracking")
      .select()
      .eq("user_id", user.id)
      .single();

    console.log("Usage data:", usageData, "Error:", usageError);

    // If no record exists, create one with count 0
    if (usageError && usageError.code === "PGRST116") {
      const { data: newUsageData, error: insertError } = await supabaseClient
        .from("usage_tracking")
        .insert({
          user_id: user.id,
          usage_count: Number(Deno.env.get("USAGE_LIMIT_INITIAL")),
          email: user.email,
        })
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
        },
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

    console.log(
      "Sending request to Dify with payload:",
      JSON.stringify(difyPayload),
    );

    const difyResponse = await fetch("https://api.dify.ai/v1/workflows/run", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Deno.env.get("DIFY_API_KEY_NO_SYNTH")}`,
      },
      body: JSON.stringify(difyPayload),
    });

    // Mock Response for testing purpose
    // const difyResponse = {
    //   ok: true,
    //   status: 200,
    //   statusText: "",
    //   text: () => "",
    //   json: () => {
    //     return {
    //       data: {
    //         outputs: {
    //           "chinese":
    //             '{"overall_score":5,"max_score":10,"overall_level":"average","analysis_of_each_criteria":{"purpose_and_motivation":{"score":5,"justification":"个人陈述清晰地展现了对法律的兴趣，并提供了一些具体的经历来说明申请者的动机。然而，为了提高评分，申请者可以更深入地分析这些经历，将其与法律中的具体问题或兴趣领域联系起来。","advice_for_improvement":["讨论接触英国和美国案例如何塑造了对法律原则的理解。","反思希望在UCL攻读LLM期间发展哪些技能或知识。"]},"academic_competence":{"score":8,"justification":"个人陈述通过讨论具体的课程项目和经历展现了较强的学术能力。","advice_for_improvement":["详细说明在项目中遇到的学术局限性以及如何克服。","深入探讨所获得的可转移技能。"]},"professional_internship_competence":{"score":4,"justification":"个人陈述提到了实习经历，但缺乏对具体事件或情境的详细描述。","advice_for_improvement":["描述实习期间处理的具体案例或任务。","反思这些经历如何为进一步的法律学习做好准备。"]},"program_specific_reasons":{"score":4,"justification":"个人陈述提到了UCL的声誉和地理位置，但未提及具体的课程或模块。","advice_for_improvement":["研究并加入UCL LLM项目中与兴趣和职业目标相关的具体课程或模块的细节。","讨论某位教授的研究如何激励了他们。"]},"future_career_planning":{"score":4,"justification":"个人陈述简要提到了职业规划，但缺乏具体的细节和清晰的目标。","advice_for_improvement":["明确希望在UCL学习期间发展哪些具体的知识和技能。","清晰描述从短期目标到长期抱负的职业进程。"]},"quality_of_writing":{"score":5,"justification":"个人陈述中存在语法错误和不流畅的表达，影响了信息的传递。","advice_for_improvement":["仔细校对以消除语法错误。","使用更精准和多样化的词汇。"]}}}',
    //           "english":
    //             '{"overall_score":5,"max_score":10,"overall_level":"average","analysis_of_each_criteria":{"purpose_and_motivation":{"score":5,"justification":"The personal statement demonstrates a clear interest in law and provides some specific examples of experiences that have motivated the applicant.","advice_for_improvement":["Analyze experiences more critically, linking them to specific issues or areas of interest within law.","Reflect on the skills or knowledge they aim to develop during their LLM at UCL and how these align with their career aspirations."]},"academic_competence":{"score":8,"justification":"The personal statement demonstrates a strong academic competence by discussing specific coursework projects and experiences.","advice_for_improvement":["Elaborate on the academic limitations encountered during projects and how they were overcome.","Discuss transferable skills acquired in more detail."]},"professional_internship_competence":{"score":4,"justification":"The personal statement mentions two internship experiences, including the names of the institutions and job roles, as well as listing job responsibilities.","advice_for_improvement":["Describe a particular case or task worked on during internships, detailing challenges faced, methods used to address them, and outcomes achieved.","Reflect on how these experiences have prepared them for further study in law."]},"program_specific_reasons":{"score":4,"justification":"The personal statement mentions generic program features such as UCL\'s reputation, distinguished professors, and its location in London.","advice_for_improvement":["Research and include details about specific courses or modules offered in the LLM program at UCL that align with their interests and career goals.","Discuss a professor whose work inspires them or a unique aspect of UCL\'s legal clinics."]},"future_career_planning":{"score":4,"justification":"The personal statement briefly mentions a career plan, specifying the legal industry and a job role.","advice_for_improvement":["Specify what particular knowledge and skills they aim to develop during their studies at UCL and how these will contribute to their career progression.","Outline a clear progression from short-term goals to long-term ambitions."]},"quality_of_writing":{"score":5,"justification":"The personal statement contains numerous grammatical errors and awkward phrasing that distract from the overall message.","advice_for_improvement":["Proofread carefully to eliminate errors and consider using more precise and varied vocabulary.","Use more complex sentence structures to enhance the writing style."]}}}',
    //         },
    //       },
    //     };
    //   },
    // };

    if (!difyResponse.ok) {
      const errorText = await difyResponse.text();
      console.error("Dify API error response:", errorText);
      throw new Error(
        `Dify API error: ${difyResponse.status} ${difyResponse.statusText}\nResponse: ${errorText}`,
      );
    }

    const difyData = await difyResponse.json();
    console.log("Edge Function: Dify API response:", difyData);

    if (
      !difyData ||
      !difyData.data ||
      !difyData.data.outputs ||
      !difyData.data.outputs.english ||
      !difyData.data.outputs.chinese
    ) {
      throw new Error("Invalid response format from Dify API");
    }

    // Increment usage count after successful analysis
    const { error: updateError } = await supabaseClient
      .from("usage_tracking")
      .update({ usage_count: currentUsage - 1 })
      .eq("user_id", user.id);

    if (updateError) {
      console.error("Usage update error:", updateError);
      throw new Error("Failed to update usage count");
    }

    const data = {
      analysis: {
        english: difyData.data.outputs.english,
        chinese: difyData.data.outputs.chinese,
      },
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
