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
    <div className="fixed top-0 left-0 right-0 p-4 flex justify-between items-center z-50">
      <Link to="/" className="hover:text-primary transition-colors">
        <Home className="w-6 h-6" />
      </Link>
      
      {email ? (
        <div className="flex items-center gap-2">
          <User className="w-4 h-4" />
          <span className="text-sm text-muted-foreground">{email}</span>
        </div>
      ) : (
        <Link to="/login">
          <Button variant="ghost" size="sm" className="gap-2">
            <User className="w-4 h-4" />
            登录
          </Button>
        </Link>
      )}
    </div>
  )
}