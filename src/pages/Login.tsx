import { AuthForm } from "@/components/auth/AuthForm"

const Login = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="w-full max-w-md p-6 bg-card rounded-lg shadow-lg">
        <div className="mb-4 text-sm text-muted-foreground">
          目前我们仅支持邮箱注册，给您带来不便，还请谅解。注册成功后您可以免费体验三次反馈超千字的文书深度评估！点击注册后请查收邮箱的确认邮件~
        </div>
        <h1 className="text-2xl font-bold text-center mb-6">欢迎回来</h1>
        <AuthForm />
      </div>
    </div>
  )
}

export default Login