import { AuthForm } from "@/components/auth/AuthForm"

const Login = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="max-w-xl w-full mx-auto px-6">
        <div className="w-full bg-card rounded-lg shadow-lg p-8">
          <h1 className="text-2xl font-bold text-center mb-6">欢迎回来</h1>
          <AuthForm />
        </div>
      </div>
    </div>
  )
}

export default Login