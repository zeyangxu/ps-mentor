import { AuthForm } from "@/components/auth/AuthForm"

const Login = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="max-w-xl w-full mx-auto px-6">
        <div className="mb-4 text-sm text-muted-foreground">
          目前我们仅支持邮箱这一种注册方式，给您带来不便，还请谅解。
          <br />
          注册成功后您可以免费体验三次反馈超千字的文书深度评估！点击注册后请查收邮箱的确认邮件~
        </div>
        <div className="w-full bg-card rounded-lg shadow-lg p-8">
          <h1 className="text-2xl font-bold text-center mb-6">欢迎回来</h1>
          <AuthForm />
        </div>
      </div>
    </div>
  )
}

export default Login