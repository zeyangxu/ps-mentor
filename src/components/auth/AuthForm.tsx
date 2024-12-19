import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

export function AuthForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log("Attempting authentication:", { isSignUp, email });
      
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
        
        if (error) {
          console.error("Sign in error:", error);
          throw error;
        }

        if (data?.session) {
          toast({
            title: "欢迎回来！",
            description: "登录成功。",
          });
          
          setTimeout(() => {
            console.log("Navigating to editor with session:", data.session);
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

  return (
    <form onSubmit={handleAuth} className="space-y-4">
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
  );
}