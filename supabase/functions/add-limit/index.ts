import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { getVerifyParams, md5, PaymentData } from "../checkout/zpay.sdk.ts";
import { getUserInfo } from "../_shared/auth.ts";
import { MoneyUsageMap } from "../_common/payment.ts";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const params: PaymentData = await req.json();
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

    const signRecalculate = await md5(paramString + Deno.env.get("ZPAY_KEY"));

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
    const { data: existingPayment, error: checkPaymentError } =
      await supabaseClient
        .from("payment_records")
        .select()
        .eq("payment_id", restParams.param);

    console.log("🦄 === [add-limit] 2", {
      existingPayment,
      checkPaymentError,
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
      .update({
        usage_count: newUsageData.usage_count + MoneyUsageMap[params.money],
      })
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
      JSON.stringify({ success: false, message: (error as Error).message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      },
    );
  }
});
