import { PRIVATE_RSA_KEY, YI_PAY_ENDPOINT } from "../_common/yiPay";
import { YiPaymentRequest } from "../_types/yiPay";
import { APISignature } from "../_utils/sign";

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
