// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { generatePaymentUrl, PaymentData } from "./zpay.sdk.ts";
import { getUserInfo } from "../_shared/auth.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { MoneyUsageMap } from "../_common/payment.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const params: PaymentData & { extra: Record<string, string> } = await req
    .json();

  // Generate payment URL
  try {
    if (
      !Object.keys(MoneyUsageMap).some((price) =>
        Number(price) === Number(params.money)
      )
    ) {
      throw new Error("Invalid topup amount");
    }

    const { userInfo } = await getUserInfo(req);

    console.log("🦄 === [checkout] user", userInfo);

    const paymentData: PaymentData = {
      pid: Deno.env.get("ZPAY_ID") ?? "",
      type: params.type,
      money: params.money,
      name: params.name,
      notify_url: params.notify_url,
      return_url: params.return_url,
      param: `${userInfo.id}_${Date.now()}`,
      out_trade_no:
        new Date().toISOString().replace(/[-T:]/g, "").slice(0, 14) +
        Math.floor(Math.random() * 1000)
          .toString()
          .padStart(3, "0"),
    };

    const paymentUrl = await generatePaymentUrl(
      paymentData,
      Deno.env.get("ZPAY_KEY") ?? "",
    );
    console.log("Payment URL:", paymentUrl);
    return new Response(JSON.stringify({ code: 0, link: paymentUrl }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ code: 1, message: (error as Error).message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
