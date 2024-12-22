import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

export function AuthForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [showOtpInput, setShowOtpInput] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
          },
        });
        
        if (error) throw error;
        
        toast({
          title: "请查看您的邮箱",
          description: "我们已发送验证链接至您的邮箱。",
        });
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (error) throw error;

        if (data?.session) {
          toast({
            title: "欢迎回来！",
            description: "登录成功。",
          });
          
          setTimeout(() => {
            navigate("/editor");
          }, 100);
        }
      }
    } catch (error) {
      console.error("Auth error:", error);
      
      let errorMessage = "发生未知错误";
      if (error.message === "Invalid login credentials") {
        errorMessage = "邮箱或密码错误";
      } else if (error.message.includes("Email not confirmed")) {
        errorMessage = "请先验证您的邮箱地址";
      }
      
      toast({
        variant: "destructive",
        title: "认证错误",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

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
          type: isSignUp ? "signup" : "sms",
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
    <Tabs defaultValue="email" className="w-full">
      <TabsList className="grid w-full grid-cols-2 mb-4">
        <TabsTrigger value="email">邮箱登录</TabsTrigger>
        <TabsTrigger value="phone">手机登录</TabsTrigger>
      </TabsList>

      <TabsContent value="email">
        <form onSubmit={handleEmailAuth} className="space-y-4">
          <Input
            type="email"
            placeholder="邮箱"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full"
          />
          <Input
            type="password"
            placeholder="密码"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full"
            minLength={6}
          />
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "加载中..." : isSignUp ? "注册" : "登录"}
          </Button>
          <Button
            type="button"
            variant="ghost"
            className="w-full"
            onClick={() => setIsSignUp(!isSignUp)}
          >
            {isSignUp ? "已有账号？点击登录" : "没有账号？点击注册"}
          </Button>
        </form>
      </TabsContent>

      <TabsContent value="phone">
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
                      <InputOTPSlot key={idx} {...slot} />
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
      </TabsContent>
    </Tabs>
  );
}