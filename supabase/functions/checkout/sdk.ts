// epay_core.ts

/** Configuration interface for EpayCore */
export interface EpayConfig {
  apiurl: string;
  pid: string | number;
  platform_public_key: string;
  merchant_private_key: string;
}

/** Payment parameters interface */
export interface PayParams {
  [key: string]: string | number | undefined;
}

/** API response interface */
export interface ApiResponse {
  code: number;
  msg?: string;
  sign?: string;
  timestamp?: number;
  status?: number;
  [key: string]: any;
}

export class EpayCore {
  private apiurl: string;
  private pid: string | number;
  private platform_public_key: string;
  private merchant_private_key: string;
  private sign_type = "RSA";

  constructor(config: EpayConfig) {
    this.apiurl = config.apiurl;
    this.pid = config.pid;
    this.platform_public_key = config.platform_public_key;
    this.merchant_private_key = config.merchant_private_key;
  }

  /**
   * Generate payment page HTML
   */
  public async pagePay(
    paramTmp: PayParams,
    button = "正在跳转",
  ): Promise<string> {
    const requrl = `${this.apiurl}api/pay/submit`;
    const param = await this.buildRequestParam(paramTmp);

    let html = `<form id="dopay" action="${requrl}" method="post">`;
    for (const [k, v] of Object.entries(param)) {
      html += `<input type="hidden" name="${k}" value="${v}"/>`;
    }
    html += `<input type="submit" value="${button}"></form>`;
    html += '<script>document.getElementById("dopay").submit();</script>';

    return html;
  }

  /**
   * Get payment link
   */
  public async getPayLink(paramTmp: PayParams): Promise<string> {
    const requrl = `${this.apiurl}api/pay/submit`;
    const param = await this.buildRequestParam(paramTmp);
    const searchParams = new URLSearchParams();

    for (const [key, value] of Object.entries(param)) {
      if (value !== undefined) {
        searchParams.append(key, value.toString());
      }
    }

    return `${requrl}?${searchParams.toString()}`;
  }

  /**
   * API payment
   */
  public async apiPay(params: PayParams): Promise<ApiResponse> {
    return await this.execute("api/pay/create", params);
  }

  /**
   * Execute API request
   */
  private async execute(path: string, params: PayParams): Promise<ApiResponse> {
    path = path.replace(/^\//, "");
    const requrl = `${this.apiurl}${path}`;
    const param = await this.buildRequestParam(params);

    try {
      const formData = new URLSearchParams();
      for (const [key, value] of Object.entries(param)) {
        if (value !== undefined) {
          formData.append(key, value.toString());
        }
      }

      const response = await fetch(requrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData.toString(),
      });

      const arr = await response.json();
      if (arr && arr.code === 0) {
        if (!(await this.verify(arr))) {
          throw new Error("返回数据验签失败");
        }
        return arr;
      } else {
        throw new Error(arr ? arr.msg : "请求失败");
      }
    } catch (error) {
      throw error;
    }
  }

  /**
   * Verify callback
   */
  public async verify(arr: ApiResponse): Promise<boolean> {
    if (!arr || !arr.sign) return false;
    if (!arr.timestamp || Math.abs(Date.now() / 1000 - arr.timestamp) > 300)
      return false;

    const sign = arr.sign;
    return await this.rsaPublicVerify(this.getSignContent(arr), sign);
  }

  /**
   * Check order payment status
   */
  public async orderStatus(tradeNo: string): Promise<boolean> {
    try {
      const result = await this.queryOrder(tradeNo);
      return !!(result && result.status === 1);
    } catch {
      return false;
    }
  }

  /**
   * Query order
   */
  public async queryOrder(tradeNo: string): Promise<ApiResponse> {
    const params = {
      trade_no: tradeNo,
    };
    return await this.execute("api/pay/query", params);
  }

  /**
   * Refund order
   */
  public async refund(
    outRefundNo: string,
    tradeNo: string,
    money: number,
  ): Promise<ApiResponse> {
    const params = {
      trade_no: tradeNo,
      money: money,
      out_refund_no: outRefundNo,
    };
    return await this.execute("api/pay/refund", params);
  }

  private async buildRequestParam(params: PayParams): Promise<PayParams> {
    const newParams = { ...params };
    newParams.pid = this.pid;
    newParams.timestamp = Math.floor(Date.now() / 1000).toString();
    newParams.sign = await this.getSign(newParams);
    newParams.sign_type = this.sign_type;
    return newParams;
  }

  private async getSign(params: PayParams): Promise<string> {
    return await this.rsaPrivateSign(this.getSignContent(params));
  }

  private getSignContent(params: PayParams): string {
    const sortedParams: { [key: string]: any } = {};
    Object.keys(params)
      .sort()
      .forEach((key) => {
        const value = params[key];
        if (
          !Array.isArray(value) &&
          !this.isEmpty(value) &&
          key !== "sign" &&
          key !== "sign_type"
        ) {
          sortedParams[key] = value;
        }
      });

    return new URLSearchParams(
      sortedParams as Record<string, string>,
    ).toString();
  }

  private isEmpty(value: any): boolean {
    return value === null || value === undefined || String(value).trim() === "";
  }

  private async rsaPrivateSign(data: string): Promise<string> {
    try {
      const keyPEM =
        "-----BEGIN PRIVATE KEY-----\n" +
        this.merchant_private_key.match(/.{1,64}/g)?.join("\n") +
        "\n-----END PRIVATE KEY-----";

      const privateKey = await crypto.subtle.importKey(
        "pkcs8",
        this.pemToBuffer(keyPEM),
        {
          name: "RSASSA-PKCS1-v1_5",
          hash: "SHA-256",
        },
        false,
        ["sign"],
      );

      const encoder = new TextEncoder();
      const dataBuffer = encoder.encode(data);

      const signature = await crypto.subtle.sign(
        "RSASSA-PKCS1-v1_5",
        privateKey,
        dataBuffer,
      );

      return btoa(String.fromCharCode(...new Uint8Array(signature)));
    } catch (error) {
      throw new Error("签名失败，商户私钥错误");
    }
  }

  private async rsaPublicVerify(data: string, sign: string): Promise<boolean> {
    try {
      const keyPEM =
        "-----BEGIN PUBLIC KEY-----\n" +
        this.platform_public_key.match(/.{1,64}/g)?.join("\n") +
        "\n-----END PUBLIC KEY-----";

      const publicKey = await crypto.subtle.importKey(
        "spki",
        this.pemToBuffer(keyPEM),
        {
          name: "RSASSA-PKCS1-v1_5",
          hash: "SHA-256",
        },
        false,
        ["verify"],
      );

      const encoder = new TextEncoder();
      const dataBuffer = encoder.encode(data);
      const signatureBuffer = Uint8Array.from(atob(sign), (c) =>
        c.charCodeAt(0),
      );

      return await crypto.subtle.verify(
        "RSASSA-PKCS1-v1_5",
        publicKey,
        signatureBuffer,
        dataBuffer,
      );
    } catch (error) {
      throw new Error("验签失败，平台公钥错误");
    }
  }

  private pemToBuffer(pem: string): ArrayBuffer {
    const base64 = pem
      .replace(/-----BEGIN (PRIVATE|PUBLIC) KEY-----/, "")
      .replace(/-----END (PRIVATE|PUBLIC) KEY-----/, "")
      .replace(/\s+/g, "");

    const binary = atob(base64);
    const buffer = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      buffer[i] = binary.charCodeAt(i);
    }
    return buffer.buffer;
  }
}
