// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { EpayCore } from "./sdk.ts";
import epayConfig from "./epay.config.ts";
import { generatePaymentUrl, PaymentData } from "./zpay.sdk.ts";

Deno.serve(async (req) => {
  const params: PaymentData = await req.json();
  const epaySdk = new EpayCore(epayConfig);

  console.log("🦄 === [add-limit]", params);

  const paymentData: PaymentData = {
    pid: "20220726190052",
    type: "alipay",
    "money": "0.01",
    name: params.name,
    sitename: params.sitename,
    notify_url: params.notify_url,
    return_url: params.return_url,
    param: "test-param",
    out_trade_no: new Date().toISOString().replace(/[-T:]/g, "").slice(0, 14) +
      Math.floor(Math.random() * 1000)
        .toString()
        .padStart(3, "0"),
    // return_url: params.return_url,
    // sitename: params.sitename,
  };

  const key = "vg9ZRZN4FOKtDM06UfqH69GDJoG4gGIJ";

  // Generate payment URL
  try {
    const paymentUrl = await generatePaymentUrl(paymentData, key);
    console.log("Payment URL:", paymentUrl);
    return new Response(JSON.stringify({ code: 0, link: paymentUrl }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ code: 1, message: error.message }), {
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const link = await epaySdk.getPayLink({
      pid: 9870,
      method: "web",
      device: "pc",
      type: "alipay",
      notify_url: "",
      return_url: "https://statement-sage.lovable.app/editor",
      name: "文书打分使用次数",
      money: "20.00",
      timestamp: "1734870485",
    });
    return new Response(JSON.stringify({ code: 0, link }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ code: 1, message: err.message }), {
      headers: { "Content-Type": "application/json" },
    });
  }
});
