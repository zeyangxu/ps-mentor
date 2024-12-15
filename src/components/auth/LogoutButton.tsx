import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/lib/supabase"

export function LogoutButton() {
  const { toast } = useToast()

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      
      toast({
        title: "Logged out",
        description: "You've been successfully logged out.",
      })
    } catch (error) {
      console.error("Logout error:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to log out. Please try again.",
      })
    }
  }

  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={handleLogout}
      className="gap-2"
    >
      <LogOut className="h-4 w-4" />
      Logout
    </Button>
  )
}