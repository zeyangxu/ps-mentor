// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import crypto from "crypto";

const YI_PAY_ENDPOINT = "https://yi-pay.com/api/pay/submit";

const OWNER_RSA_KEY =
  "MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDKqffiMDRO3Had7MIWfvi/MIUPtCq9oxlqxbcGZV8JT2IJP7JvLZYVIXGQbvLqcr1xcdUD6ORWhgF3Lha1lXb4a5tDI7/rkJ4YwEYRro3FEXx0yVlxABHjCKD0qVIJjtgCesXOewgsD7L7PaZ+wStl78WEd3PwVPHclePX0hwUd0TCyWQxTyAXv0+FWnT+IGhvlbApnPNcEf9fT6l6Zxmm8vHc+O4C/7g3oN5gqIFT4djdbiWf14L+znn/2ji51Kek8oysk+bz8xco5iqwO3XqxttH9vgqF0RvxGuLTKNzQq4zHUUgSqsBxlXPfXL9CUDSzKkrZ9apBvV1dHRdeGkZAgMBAAECggEBALkUrk+/7BVVG3KwRLQcsviPzAUCacIUEGNFOxe5PiiXeZWuuTr1a8nSaA8ac/eOX9oZtgrDBrzJ1s7LpWuhmyvVwc53+I6d3PQHrDX7rncZuApD083x3WP0fmHRvB0EedsR2lHuZBExKShvLf02VnbamQyXtqb2PIdRz+lKdeBtRtAn9EQNCEQANxy4r91ZyUmwjUZJNOM1MJjbicub/kqpreF8Zm+z2BzgQOHHklceS0NM3MP44iGB9KOwFH3TL8kjYNQ+nqwHp2vTtjKE4biMzvwmT0C3aoFvYad5U52YTE0ckjANZatsrEXYeqSflqX1HVQmTImqNg6N/QpFfLECgYEA8x8+wSfejccvW44+ZrqRQqIsRbAiqbOGnfhUzRyBZUF73ubY2YgR54E4BZTg8DwrCq4df2U24spw6o/h7RLf61JKwxhE+ORjhAmOwFTi7AFm5WZ+nW7jh+ScPkLzLC04HzzgAFIVlDDraQP8NBsBmZbFTl6pBUnppbShYDltmWUCgYEA1WYbnAbAmA8Xko8Qvnq/Caj6gG9QEw2AP14gF4ECrNgYukM45JQR1cp21ao2t0O1IrkPcACT3KdfcipG5xs6FtmtBvkNvGCWoVrthKtyQLQ3/b8x6PfVhiQxzOcw4fMTNjtnVJGkiyrbPifCLDvHfQ3Gb+K8jEbAjAENVkrPL6UCgYBwgPnyOjfjldPVY0p/EUCc/BzOlsZDj17xBPSBAfri112x9VNNvojCf2pkMtOwd7dXNuFRjY3LfvCnqrNamIxkAe20wCtSnaVreVzEpcNogPGToE1hHupNfT3MFgEfZUF+OxZRL6rqq4SUURLJLeIcp8dgD6/ZUa28T40J0SllfQKBgGZ5fQKk33Flte0kFGdT7E8IPRrV2T78+bv0SDbhNdaogt9XDof9br8aVYxvC41fzyjYc0hWjqqkGRpqoNez5GY6q3Mwv97ZBxx+3JYb+maF5GlOmfoEoR2kXeHGl1u5bV1ak1kyAzDtKJElaIHzRu2PYt4xpFc8VpQkoTHyBKIdAoGBAKofM4GzjSFyHZeZd2W3Vf5ax3guFwNx0NidUwWwYYb3ulJshvHY4e7C+QAQKH7LgeyCArNo0wKBIGN1Xrtm/IHhH2jrGbThYKQrKqgMokvJlVBLzukLEL8PHg4FRkN/UtibugnS3ZzaNgKcPnq4gx48V947Z1xgZuGfs0hiF8IS";

const PLATFORM_RSA_KEY =
  "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEApvhuxBKuzEBRzJR3d3raeqERV8NXBSX3S1ZjyW4tcZ+MOdeb7iWIFUNuhKakOUWaUOWtBtnM1CrNI43MNxv9urrNvychR4F/QO6MamHHz9Tkniuu8uB+M0S04QYL2AFoMbcM8sIiR23A16Lt0EFieneJbALIn6VXLTRjnyBJmVvjufKWBNMhVPaPufaVlBgkojf92oLHVIZn6DFFjX7EJN9ijVH9jJTb/qbjxWBoaOiVCvMCItteuUX1qxm5gzdBhL5NWF8j+kpkO2P6y+zb8TT5RDTT6zyaForK2FBmQMyhuIkElvXIdeQ+xvtnx2G5XH+VMRV60+S3t9wtJno2QQIDAQAB";

const PRIVATE_RSA_KEY =
  "MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDKqffiMDRO3Had7MIWfvi/MIUPtCq9oxlqxbcGZV8JT2IJP7JvLZYVIXGQbvLqcr1xcdUD6ORWhgF3Lha1lXb4a5tDI7/rkJ4YwEYRro3FEXx0yVlxABHjCKD0qVIJjtgCesXOewgsD7L7PaZ+wStl78WEd3PwVPHclePX0hwUd0TCyWQxTyAXv0+FWnT+IGhvlbApnPNcEf9fT6l6Zxmm8vHc+O4C/7g3oN5gqIFT4djdbiWf14L+znn/2ji51Kek8oysk+bz8xco5iqwO3XqxttH9vgqF0RvxGuLTKNzQq4zHUUgSqsBxlXPfXL9CUDSzKkrZ9apBvV1dHRdeGkZAgMBAAECggEBALkUrk+/7BVVG3KwRLQcsviPzAUCacIUEGNFOxe5PiiXeZWuuTr1a8nSaA8ac/eOX9oZtgrDBrzJ1s7LpWuhmyvVwc53+I6d3PQHrDX7rncZuApD083x3WP0fmHRvB0EedsR2lHuZBExKShvLf02VnbamQyXtqb2PIdRz+lKdeBtRtAn9EQNCEQANxy4r91ZyUmwjUZJNOM1MJjbicub/kqpreF8Zm+z2BzgQOHHklceS0NM3MP44iGB9KOwFH3TL8kjYNQ+nqwHp2vTtjKE4biMzvwmT0C3aoFvYad5U52YTE0ckjANZatsrEXYeqSflqX1HVQmTImqNg6N/QpFfLECgYEA8x8+wSfejccvW44+ZrqRQqIsRbAiqbOGnfhUzRyBZUF73ubY2YgR54E4BZTg8DwrCq4df2U24spw6o/h7RLf61JKwxhE+ORjhAmOwFTi7AFm5WZ+nW7jh+ScPkLzLC04HzzgAFIVlDDraQP8NBsBmZbFTl6pBUnppbShYDltmWUCgYEA1WYbnAbAmA8Xko8Qvnq/Caj6gG9QEw2AP14gF4ECrNgYukM45JQR1cp21ao2t0O1IrkPcACT3KdfcipG5xs6FtmtBvkNvGCWoVrthKtyQLQ3/b8x6PfVhiQxzOcw4fMTNjtnVJGkiyrbPifCLDvHfQ3Gb+K8jEbAjAENVkrPL6UCgYBwgPnyOjfjldPVY0p/EUCc/BzOlsZDj17xBPSBAfri112x9VNNvojCf2pkMtOwd7dXNuFRjY3LfvCnqrNamIxkAe20wCtSnaVreVzEpcNogPGToE1hHupNfT3MFgEfZUF+OxZRL6rqq4SUURLJLeIcp8dgD6/ZUa28T40J0SllfQKBgGZ5fQKk33Flte0kFGdT7E8IPRrV2T78+bv0SDbhNdaogt9XDof9br8aVYxvC41fzyjYc0hWjqqkGRpqoNez5GY6q3Mwv97ZBxx+3JYb+maF5GlOmfoEoR2kXeHGl1u5bV1ak1kyAzDtKJElaIHzRu2PYt4xpFc8VpQkoTHyBKIdAoGBAKofM4GzjSFyHZeZd2W3Vf5ax3guFwNx0NidUwWwYYb3ulJshvHY4e7C+QAQKH7LgeyCArNo0wKBIGN1Xrtm/IHhH2jrGbThYKQrKqgMokvJlVBLzukLEL8PHg4FRkN/UtibugnS3ZzaNgKcPnq4gx48V947Z1xgZuGfs0hiF8IS";

type YiPaymentRequestSigned = YiPaymentRequest & {
  // 签名字符串 - Signature string
  sign: string;

  // 签名类型 - Signature type (RSA)
  sign_type: string;
};

interface YiPaymentRequest {
  // 商户ID - Merchant ID
  pid: number;

  // 支付方式 - Payment method
  type: string;

  // 商户订单号 - Merchant order number
  out_trade_no: string;

  // 异步通知地址 - Asynchronous notification URL
  notify_url: string;

  // 跳转通知地址 - Return URL for redirect
  return_url: string;

  // 商品名称 - Product name (max 127 bytes)
  name: string;

  // 商品金额 - Amount (in yuan, max 2 decimal places)
  money: string;

  // 业务扩展参数 - Extended business parameters (optional)
  param?: string;

  // 当前时间戳 - Current timestamp (10 digits, in seconds)
  timestamp: string;
}

Deno.serve(async (req) => {
  const params = await req.json();
  const res = await requestYiPaySubmitSigned(params);

  return new Response(JSON.stringify(res), {
    headers: { "Content-Type": "application/json" },
  });
});

export async function requestYiPaySubmitSigned(params: YiPaymentRequest) {
  try {
    // Generate signature
    const { signedParams } = APISignature.sign({
      params,
      privateKey: PRIVATE_RSA_KEY,
    });

    // Make API request with signed parameters
    const response = await fetch(YI_PAY_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(signedParams),
    });

    return await response.json();
  } catch (error) {
    console.error("API request failed:", error);
    throw error;
  }
}

interface SignatureParams {
  // API request parameters excluding sign and sign_type
  params: Record<string, any>;
  // Private key for RSA signing
  privateKey: string;
}

interface SignatureResult {
  // Final parameters including signature
  signedParams: Record<string, any>;
  // Generated signature
  signature: string;
}

export class APISignature {
  /**
   * Generates a signature for API requests
   * @param params Request parameters
   * @param privateKey RSA private key
   * @returns Object containing signed parameters and signature
   */
  static sign(options: SignatureParams): SignatureResult {
    const { params, privateKey } = options;

    // Step 1: Filter and sort parameters
    const filteredParams = this.filterAndSortParams(params);

    // Step 2: Create parameter string
    const paramString = this.createParamString(filteredParams);

    // Step 3: Generate RSA signature
    const signature = this.generateSignature(paramString, privateKey);

    // Add signature to parameters
    const signedParams = {
      ...params,
      sign_type: "SHA256WithRSA",
      sign: signature,
    };

    return {
      signedParams,
      signature,
    };
  }

  /**
   * Filters out sign/sign_type and sorts parameters by ASCII key order
   * @param params Original parameters
   * @returns Filtered and sorted parameters
   */
  private static filterAndSortParams(
    params: Record<string, any>,
  ): Record<string, any> {
    // Remove sign and sign_type parameters
    const { sign, sign_type, ...restParams } = params;

    // Sort keys by ASCII value
    const sortedKeys = Object.keys(restParams).sort();

    // Create new sorted object
    return sortedKeys.reduce(
      (acc, key) => {
        acc[key] = restParams[key];
        return acc;
      },
      {} as Record<string, any>,
    );
  }

  /**
   * Creates parameter string in format key1=value1&key2=value2
   * @param params Sorted parameters
   * @returns Parameter string for signing
   */
  private static createParamString(params: Record<string, any>): string {
    return Object.entries(params)
      .map(([key, value]) => `${key}=${value}`)
      .join("&");
  }

  /**
   * Generates RSA signature using SHA256
   * @param content Content to sign
   * @param privateKey RSA private key
   * @returns Base64 encoded signature
   */
  private static generateSignature(
    content: string,
    privateKey: string,
  ): string {
    const sign = crypto.createSign("SHA256");
    sign.update(content);
    return sign.sign(privateKey, "base64");
  }
}

// Example usage:
async function makeAPIRequest(
  endpoint: string,
  params: Record<string, any>,
  privateKey: string,
) {
  try {
    // Generate signature
    const { signedParams } = APISignature.sign({
      params,
      privateKey,
    });

    // Make API request with signed parameters
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(signedParams),
    });

    return await response.json();
  } catch (error) {
    console.error("API request failed:", error);
    throw error;
  }
}
