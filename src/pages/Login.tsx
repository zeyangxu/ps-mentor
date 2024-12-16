import { AuthForm } from "@/components/auth/AuthForm"

const Login = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="w-full max-w-md p-6 bg-card rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-6">Welcome Back</h1>
        <AuthForm />
      </div>
    </div>
  )
}

export default Login