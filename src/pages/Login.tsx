import { AuthForm } from "@/components/auth/AuthForm";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";

const Login = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary/50 to-background relative overflow-hidden">
      <div className="flex items-center justify-center min-h-screen">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-20 w-24 h-24 rounded-full bg-primary/10 animate-pulse [animation-duration:3s]" />
          <div className="absolute bottom-20 right-20 w-32 h-32 rounded-full bg-primary/10 animate-pulse [animation-duration:3s] [animation-delay:1s]" />
          <div className="absolute top-40 right-40 w-16 h-16 rounded-full bg-primary/10 animate-pulse [animation-duration:3s] [animation-delay:2s]" />
        </div>

        <div className="max-w-[700px] w-full mx-auto px-6 relative animate-fade-up">
          <div className="flex justify-center mb-8">
            <img
              src="/lovable-uploads/392db423-89a7-4be0-be5f-d508e73d5651.png"
              alt="PS Logo"
              className="w-20 h-20 hover:scale-110 transition-transform duration-300"
            />
          </div>
          <Alert className="mb-6">
            <InfoIcon className="h-4 w-4" />
            <AlertDescription className="ml-2 whitespace-nowrap overflow-x-auto">
              目前Dr. PS Checker 仅支持邮箱这一种注册方式，给您带来不便，还请谅解。
              <br />
              点击注册后，请前往您的邮箱，点击Supabase发来邮件中的确认链接完成注册。
              <br />
              注册成功后，您可以免费体验 1 次反馈超千字的文书深度评估。😊
            </AlertDescription>
          </Alert>
          <div className="w-full bg-card rounded-lg shadow-lg p-8 relative z-10 hover:scale-[1.01] transition-transform duration-300">
            <h1 className="text-2xl font-bold text-center mb-6">欢迎回来</h1>
            <AuthForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;