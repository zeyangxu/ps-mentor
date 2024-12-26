import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Loader2 } from "lucide-react";

export const PaymentOptions = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handlePayment = async (
    amount: string,
    type: "alipay" | "wxpay" = "alipay",
  ) => {
    try {
      setIsLoading(true);
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) {
        toast({
          variant: "destructive",
          title: "错误",
          description: "请先登录后再进行支付",
        });
        return;
      }

      const functionUrl =
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/checkout`;
      const response = await fetch(functionUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session.session.access_token}`,
          "apikey": import.meta.env.VITE_SUPABASE_ANON_KEY,
        },
        body: JSON.stringify({
          name: "充值分析次数",
          money: amount,
          type: type,
          notify_url:
            `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/add-limit`,
          return_url: `${window.location.origin}/payment`,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate payment link");
      }

      const data = await response.json();
      if (data.code === 0 && data.link) {
        window.location.href = data.link;
      } else {
        throw new Error("Invalid payment link response");
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast({
        variant: "destructive",
        title: "支付链接生成失败",
        description: "请稍后重试或联系客服",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative">
      {isLoading && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">正在生成支付链接...</p>
          </div>
        </div>
      )}
      <div className="grid md:grid-cols-2 gap-4">
        <Card className="p-6 flex flex-col items-center space-y-4 justify-between">
          <div className="text-center">
            <h3 className="text-2xl font-bold">
              ¥{import.meta.env.VITE_PAYMENT_PLAN_ONE}
            </h3>
            <p className="text-muted-foreground">单次分析</p>
          </div>
          <ul className="space-y-2 text-sm">
            <li>✓ 一次完整的文书分析</li>
            <li>✓ 详细的评分和建议</li>
            <li>✓ 专业的修改指导</li>
          </ul>
          <div className="flex flex-col w-full gap-2">
            <Button
              className="w-full"
              onClick={() =>
                handlePayment(import.meta.env.VITE_PAYMENT_PLAN_ONE, "alipay")}
              disabled={isLoading}
            >
              支付宝支付
            </Button>
            <Button
              variant="secondary"
              className="w-full"
              onClick={() =>
                handlePayment(import.meta.env.VITE_PAYMENT_PLAN_ONE, "wxpay")}
              disabled={isLoading}
            >
              微信支付
            </Button>
          </div>
        </Card>

        <Card className="p-6 flex flex-col items-center space-y-4 justify-between">
          <div className="text-center">
            <h3 className="text-2xl font-bold">
              ¥{import.meta.env.VITE_PAYMENT_PLAN_THREE}
            </h3>
            <p className="text-muted-foreground">三次分析套餐</p>
          </div>
          <ul className="space-y-2 text-sm">
            <li>✓ 三次完整的文书分析</li>
            <li>✓ 更优惠的价格</li>
            <li>✓ 可分次使用</li>
          </ul>
          <div className="flex flex-col w-full gap-2">
            <Button
              className="w-full"
              onClick={() =>
                handlePayment(import.meta.env.VITE_PAYMENT_PLAN_THREE, "alipay")}
              disabled={isLoading}
            >
              支付宝支付
            </Button>
            <Button
              variant="secondary"
              className="w-full"
              onClick={() =>
                handlePayment(import.meta.env.VITE_PAYMENT_PLAN_THREE, "wxpay")}
              disabled={isLoading}
            >
              微信支付
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};