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
        title: "已登出",
        description: "您已成功登出。",
      })
    } catch (error) {
      console.error("Logout error:", error)
      toast({
        variant: "destructive",
        title: "错误",
        description: "登出失败，请重试。",
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
      登出
    </Button>
  )
}