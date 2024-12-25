// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { EpayCore } from "./sdk.ts";
import epayConfig from "./epay.config.ts";
import { generatePaymentUrl, PaymentData } from "./zpay.sdk.ts";
import { getUserInfo } from "../_shared/auth.ts";
import { EPAY_KEY } from "../_common/epay.ts";

Deno.serve(async (req) => {
  const params: PaymentData & { extra: Record<string, string> } = await req
    .json();
  const epaySdk = new EpayCore(epayConfig);
  const { userInfo } = await getUserInfo(req);

  console.log("🦄 === [checkout] user", userInfo);

  const paymentData: PaymentData = {
    pid: "20220726190052",
    type: "alipay",
    "money": "0.01",
    name: params.name,
    notify_url: params.notify_url,
    return_url: params.return_url,
    param: `${userInfo.id}_${Date.now()}`,
    out_trade_no: new Date().toISOString().replace(/[-T:]/g, "").slice(0, 14) +
      Math.floor(Math.random() * 1000)
        .toString()
        .padStart(3, "0"),
  };

  // Generate payment URL
  try {
    const paymentUrl = await generatePaymentUrl(paymentData, EPAY_KEY);
    console.log("Payment URL:", paymentUrl);
    return new Response(JSON.stringify({ code: 0, link: paymentUrl }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ code: 1, message: error.message }), {
      headers: { "Content-Type": "application/json" },
    });
  }
});
