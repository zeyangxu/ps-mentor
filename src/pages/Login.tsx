import { AuthForm } from "@/components/auth/AuthForm"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { InfoIcon } from "lucide-react"
import { Header } from "@/components/Header"

const Login = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary/50 to-background flex items-center justify-center relative overflow-hidden">
      <Header />
      {/* Decorative animated elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-8 left-8 w-24 h-24">
          <div className="absolute w-16 h-1 bg-primary/20 rounded-full transform rotate-45"></div>
          <div className="absolute w-16 h-1 bg-primary/20 rounded-full transform rotate-45 translate-y-4"></div>
          <div className="absolute w-16 h-1 bg-primary/20 rounded-full transform rotate-45 translate-y-8"></div>
          <div className="absolute w-3 h-3 bg-primary/30 rounded-full -translate-x-2"></div>
          <div className="absolute w-2 h-2 bg-primary/30 rounded-full translate-x-16 translate-y-6"></div>
          <div className="absolute w-2 h-2 bg-primary/30 rounded-full translate-x-12 translate-y-12"></div>
        </div>
        <div className="absolute top-8 right-8 w-24 h-24">
          <div className="absolute w-16 h-1 bg-primary/20 rounded-full transform -rotate-45"></div>
          <div className="absolute w-16 h-1 bg-primary/20 rounded-full transform -rotate-45 translate-y-4"></div>
          <div className="absolute w-16 h-1 bg-primary/20 rounded-full transform -rotate-45 translate-y-8"></div>
          <div className="absolute w-3 h-3 bg-primary/30 rounded-full translate-x-14"></div>
          <div className="absolute w-2 h-2 bg-primary/30 rounded-full -translate-x-2 translate-y-6"></div>
          <div className="absolute w-2 h-2 bg-primary/30 rounded-full translate-x-2 translate-y-12"></div>
        </div>
      </div>
      
      <div className="max-w-xl w-full mx-auto px-6 relative animate-fade-up">
        <Alert className="mb-6">
          <InfoIcon className="h-4 w-4" />
          <AlertDescription className="ml-2">
            目前我们仅支持邮箱这一种注册方式，给您带来不便，还请谅解。
            <br />
            点击注册后请前往您的邮箱点击确认链接完成注册。
            <br />
            注册成功后您可以免费体验三次反馈超千字的文书深度评估。😊
          </AlertDescription>
        </Alert>
        <div className="w-full bg-card rounded-lg shadow-lg p-8 relative z-10 hover:scale-[1.01] transition-transform duration-300">
          <h1 className="text-2xl font-bold text-center mb-6">欢迎回来</h1>
          <AuthForm />
        </div>
      </div>
    </div>
  );
};

export default Login;