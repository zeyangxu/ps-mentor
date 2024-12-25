// Import crypto module from Deno standard library for MD5 hashing
import { crypto } from "https://deno.land/std/crypto/mod.ts";
import { encode } from "https://deno.land/std/encoding/hex.ts";

// Define payment types
type PaymentType = "alipay" | "wxpay" | "qqpay" | "tenpay";

// Define the payment data interface
interface PaymentData {
  pid: string;
  money: string;
  name: string;
  notify_url: string;
  out_trade_no: string;
  return_url: string;
  sitename: string;
  type: PaymentType;
  sign?: string;
  sign_type?: string;
  param?: string;
}

/**
 * Generate MD5 hash from a string
 * @param text Text to hash
 * @returns MD5 hash string
 */
async function md5(text: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest("MD5", data);
  const hashArray = new Uint8Array(hashBuffer);
  return Array.from(hashArray)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * Sort and join parameters for verification
 * @param params Payment parameters
 * @returns Sorted and joined parameter string
 */
function getVerifyParams(params: PaymentData): string | null {
  if (!params) return null;

  const sPara: [string, string][] = [];

  for (const [key, value] of Object.entries(params)) {
    if (!value || key === "sign" || key === "sign_type") {
      continue;
    }
    sPara.push([key, value.toString()]);
  }

  sPara.sort();

  return sPara
    .map(([key, value], index) => {
      return `${key}=${value}${index === sPara.length - 1 ? "" : "&"}`;
    })
    .join("");
}

/**
 * Generate payment URL with signature
 * @param data Payment data
 * @param key Secret key
 * @returns Payment URL with signature
 */
async function generatePaymentUrl(
  data: PaymentData,
  key: string,
): Promise<string> {
  const paramString = getVerifyParams(data);
  if (!paramString) {
    throw new Error("Invalid payment parameters");
  }

  const sign = await md5(paramString + key);
  return `https://zpayz.cn/submit.php?${paramString}&sign=${sign}&sign_type=MD5`;
}

// Example usage
const paymentData: PaymentData = {
  pid: "your_pid",
  money: "amount",
  name: "product_name",
  notify_url: "http://xxxxx",
  out_trade_no:
    new Date().toISOString().replace(/[-T:]/g, "").slice(0, 14) +
    Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0"),
  return_url: "http://xxxx",
  sitename: "website_name",
  type: "alipay",
};

const key = "your_key";

// Generate payment URL
try {
  const paymentUrl = await generatePaymentUrl(paymentData, key);
  console.log("Payment URL:", paymentUrl);
} catch (error) {
  console.error("Error generating payment URL:", error);
}

export { generatePaymentUrl, PaymentData, PaymentType };
