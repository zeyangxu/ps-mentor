import { Link, useLocation } from "react-router-dom"
import { Home, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

export const MinimalNav = () => {
  const location = useLocation()
  const [email, setEmail] = useState<string | null>(null)
  const isHomePage = location.pathname === "/"

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setEmail(session?.user?.email ?? null)
    }

    getSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setEmail(session?.user?.email ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (isHomePage) return null

  return (
    <div className="fixed top-0 left-0 right-0 bg-background/80 backdrop-blur-sm border-b z-50">
      <div className="container mx-auto px-4">
        <div className="h-16 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <img 
              src="/lovable-uploads/90ada833-6e4f-405f-b17e-081f8a76bba4.png" 
              alt="PS Logo" 
              className="w-8 h-8"
            />
            <Button variant="outline" size="sm" className="gap-2">
              <Home className="w-4 h-4" />
              主页
            </Button>
          </Link>
          
          {email ? (
            <Button variant="outline" size="sm" className="gap-2">
              <User className="w-4 h-4" />
              <span className="text-sm">{email}</span>
            </Button>
          ) : (
            <Link to="/login">
              <Button variant="outline" size="sm" className="gap-2">
                <User className="w-4 h-4" />
                登录
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}