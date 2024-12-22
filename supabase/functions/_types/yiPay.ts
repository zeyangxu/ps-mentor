export type YiPaymentRequestSigned = YiPaymentRequest & {
  // 签名字符串 - Signature string
  sign: string;

  // 签名类型 - Signature type (RSA)
  sign_type: string;
};

export interface YiPaymentRequest {
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
