import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7";
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { getVerifyParams, md5 } from "../checkout/zpay.sdk.ts";
import { EPAY_KEY } from "../_common/epay.ts";
import { getUserInfo } from "../_shared/auth.ts";

const PAYMENT_SECRET = Deno.env.get("PAYMENT_SECRET") || "";
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY") || "";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const MoneyUsageMap = {
  "19.9": 1,
  "79.9": 5
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const params = await req.json();
    const { supabaseClient } = await getUserInfo(req);
    const {
      sign,
      sign_type,
      ...restParams
    } = params;

    // Verify the payment signature
    const paramString = getVerifyParams(params);
    if (!paramString) {
      throw new Error("Invalid payment parameters");
    }

    const signRecalculate = await md5(paramString + EPAY_KEY);

    if (signRecalculate !== sign || sign_type !== "MD5") {
      throw new Error("Invalid signature");
    }

    // Extract user_id from pid (format: user_id_timestamp)
    const [userId] = restParams.param.split("_");
    if (!userId) {
      throw new Error("Invalid user ID format");
    }

    console.log("🦄 === [add-limit] 1", {
      userId,
      restParams,
      sign,
      sign_type,
      signRecalculate,
    });

    // Check if this payment has already been processed
    const { data: existingPayment, error: checkPaymentError } = await supabaseClient
      .from("payment_records")
      .select()
      .eq("payment_id", restParams.param)

    console.log("🦄 === [add-limit] 2", {
      existingPayment,
      checkPaymentError
    });

    if (existingPayment.length > 0) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Payment already processed",
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        },
      );
    }

    const { data: newUsageData, error: checkUsageError } = await supabaseClient
      .from("usage_tracking")
      .select("usage_count")
      .eq("user_id", userId)
      .maybeSingle();

    console.log("🦄 === [add-limit] 2.5", {
      newUsageData,
      checkUsageError,
    });

    if (checkUsageError) {
      throw checkUsageError;
    }

    // Begin transaction
    const { data: user, error: insertError } = await supabaseClient
      .from("usage_tracking")
      .update({ usage_count: newUsageData.usage_count + 3 })
      .eq("user_id", userId);

    console.log("🦄 === [add-limit] 3", {
      user,
      newUsageData,
      insertError,
    });

    if (insertError) {
      throw insertError;
    }

    // Record the payment
    const { error: paymentError } = await supabaseClient
      .from("payment_records")
      .insert({
        payment_id: restParams.param,
        user_id: userId,
        amount: restParams.money,
        trade_no: restParams.trade_no,
        trade_status: restParams.trade_status,
        payment_type: restParams.type,
      });

    console.log("🦄 === [add-limit] 3", {});

    if (paymentError) {
      throw paymentError;
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Payment processed successfully",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      },
    );
  } catch (error) {
    console.error("Error processing payment:", error);
    return new Response(
      JSON.stringify({ success: false, message: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      },
    );
  }
});
