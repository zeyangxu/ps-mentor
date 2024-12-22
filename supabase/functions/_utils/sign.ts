import crypto from "crypto";

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
