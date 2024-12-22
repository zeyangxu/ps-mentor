import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

export function PhoneAuthForm() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [showOtpInput, setShowOtpInput] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handlePhoneAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!showOtpInput) {
        const { error } = await supabase.auth.signInWithOtp({
          phone,
        });
        
        if (error) throw error;
        
        setShowOtpInput(true);
        toast({
          title: "验证码已发送",
          description: "请查看您的手机短信。",
        });
      } else {
        const { data, error } = await supabase.auth.verifyOtp({
          phone,
          token: otp,
          type: "sms",
        });
        
        if (error) throw error;

        if (data?.session) {
          toast({
            title: "欢迎！",
            description: "登录成功。",
          });
          
          setTimeout(() => {
            navigate("/editor");
          }, 100);
        }
      }
    } catch (error) {
      console.error("Phone auth error:", error);
      
      toast({
        variant: "destructive",
        title: "认证错误",
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handlePhoneAuth} className="space-y-4">
      <Input
        type="tel"
        placeholder="手机号码 (例如: +8613800138000)"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        required
        className="w-full"
        disabled={showOtpInput}
      />
      {showOtpInput && (
        <div className="space-y-2">
          <InputOTP
            value={otp}
            onChange={(value) => setOtp(value)}
            maxLength={6}
            render={({ slots }) => (
              <InputOTPGroup>
                {slots.map((slot, idx) => (
                  <InputOTPSlot key={idx} {...slot} index={idx} />
                ))}
              </InputOTPGroup>
            )}
          />
        </div>
      )}
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "加载中..." : showOtpInput ? "验证" : "获取验证码"}
      </Button>
      {!showOtpInput && (
        <Button
          type="button"
          variant="ghost"
          className="w-full"
          onClick={() => setIsSignUp(!isSignUp)}
        >
          {isSignUp ? "已有账号？点击登录" : "没有账号？点击注册"}
        </Button>
      )}
      {showOtpInput && (
        <Button
          type="button"
          variant="ghost"
          className="w-full"
          onClick={() => {
            setShowOtpInput(false);
            setOtp("");
          }}
        >
          重新发送验证码
        </Button>
      )}
    </form>
  );
}