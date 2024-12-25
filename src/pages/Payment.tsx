import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

const Payment = () => {
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(true);
  const [status, setStatus] = useState<"success" | "error" | "processing">(
    "processing",
  );

  useEffect(() => {
    const processPayment = async () => {
      try {
        // Get all URL parameters
        const params = Object.fromEntries(searchParams.entries());
        const { data: session } = await supabase.auth.getSession();
        if (!session.session) throw new Error("No authenticated session");

        const functionUrl =
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/add-limit`;

        const response = await fetch(functionUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${session.session.access_token}`,
            "apikey": import.meta.env.VITE_SUPABASE_ANON_KEY,
          },
          body: JSON.stringify(params),
        });

        if (!response.ok) {
          console.error("Payment processing error:", error);
          setStatus("error");
          toast({
            variant: "destructive",
            title: "支付处理失败",
            description: "请联系客服处理",
          });
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (!data || !data.analysis) {
          console.error("Payment processing error:", error);
          setStatus("error");
          toast({
            variant: "destructive",
            title: "支付处理失败",
            description: "请联系客服处理",
          });
          throw new Error("Invalid response format from the function");
        }

        console.log("Payment processed successfully:", data);
        setStatus("success");
        toast({
          title: "支付处理成功",
          description: "您的使用次数已增加",
        });

        return data.analysis;
      } catch (err) {
        console.error("Error processing payment:", err);
        setStatus("error");
        toast({
          variant: "destructive",
          title: "支付处理失败",
          description: "请联系客服处理",
        });
      } finally {
        setIsProcessing(false);
      }
    };

    processPayment();
  }, [searchParams, toast]);

  return (
    <div className="container mx-auto px-4 py-8 mt-16">
      <Card className="max-w-md mx-auto p-6">
        <div className="flex flex-col items-center justify-center space-y-4">
          {isProcessing
            ? (
              <>
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <h2 className="text-xl font-semibold">正在处理支付...</h2>
                <p className="text-muted-foreground text-center">
                  请稍候，正在验证您的支付信息
                </p>
              </>
            )
            : status === "success"
            ? (
              <>
                <div className="text-green-500 text-4xl mb-4">✓</div>
                <h2 className="text-xl font-semibold">支付处理成功</h2>
                <p className="text-muted-foreground text-center">
                  您的使用次数已增加，现在可以继续使用服务了
                </p>
              </>
            )
            : (
              <>
                <div className="text-red-500 text-4xl mb-4">✗</div>
                <h2 className="text-xl font-semibold">支付处理失败</h2>
                <p className="text-muted-foreground text-center">
                  抱歉，处理您的支付时出现问题。请联系客服处理
                </p>
              </>
            )}
        </div>
      </Card>
    </div>
  );
};

export default Payment;
