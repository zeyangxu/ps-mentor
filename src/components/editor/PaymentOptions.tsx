import { Card } from "@/components/ui/card"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"

export const PaymentOptions = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const { toast } = useToast()

  const handlePayment = async (amount: string) => {
    try {
      const { data: session } = await supabase.auth.getSession()
      if (!session.session) {
        toast({
          variant: "destructive",
          title: "错误",
          description: "请先登录后再进行支付",
        })
        return
      }

      const functionUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/checkout`
      const response = await fetch(functionUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session.session.access_token}`,
          "apikey": import.meta.env.VITE_SUPABASE_ANON_KEY,
        },
        body: JSON.stringify({
          name: "充值分析次数",
          money: amount,
          notify_url: `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/add-limit`,
          return_url: `${window.location.origin}/payment`,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate payment link")
      }

      const data = await response.json()
      if (data.code === 0 && data.link) {
        window.location.href = data.link
      } else {
        throw new Error("Invalid payment link response")
      }
    } catch (error) {
      console.error("Payment error:", error)
      toast({
        variant: "destructive",
        title: "支付链接生成失败",
        description: "请稍后重试或联系客服",
      })
    }
  }

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-center">推荐使用支付宝</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <Dialog open={!!selectedImage} onOpenChange={(open) => !open && setSelectedImage(null)}>
            <Card className="p-4 flex flex-col items-center">
              <DialogTrigger asChild>
                <img 
                  src="/lovable-uploads/bc1db9f3-a61f-49b7-bd7f-240a3e196786.png" 
                  alt="支付宝支付 ¥19.90" 
                  className="w-full max-w-[240px] rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => handlePayment("19.9")}
                />
              </DialogTrigger>
              <p className="mt-2 text-lg font-semibold">¥19.90/次</p>
            </Card>
            <Card className="p-4 flex flex-col items-center">
              <DialogTrigger asChild>
                <img 
                  src="/lovable-uploads/36d54d5d-d91a-49e8-b85d-340014a5ac97.png" 
                  alt="支付宝支付 ¥79.90" 
                  className="w-full max-w-[240px] rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => handlePayment("79.9")}
                />
              </DialogTrigger>
              <p className="mt-2 text-lg font-semibold">¥79.90/5次</p>
            </Card>
          </Dialog>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-center">推荐使用微信支付</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <Dialog open={!!selectedImage} onOpenChange={(open) => !open && setSelectedImage(null)}>
            <Card className="p-4 flex flex-col items-center">
              <DialogTrigger asChild>
                <img 
                  src="/lovable-uploads/426c581c-0a3f-4603-9666-f8aac0d8a256.png" 
                  alt="微信支付 ¥19.90" 
                  className="w-full max-w-[240px] rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => handlePayment("19.9")}
                />
              </DialogTrigger>
              <p className="mt-2 text-lg font-semibold">¥19.90/次</p>
            </Card>
            <Card className="p-4 flex flex-col items-center">
              <DialogTrigger asChild>
                <img 
                  src="/lovable-uploads/0c247c28-3376-48b7-a94f-5db9edc21fda.png" 
                  alt="微信支付 ¥79.90" 
                  className="w-full max-w-[240px] rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => handlePayment("79.9")}
                />
              </DialogTrigger>
              <p className="mt-2 text-lg font-semibold">¥79.90/5次</p>
            </Card>
            <DialogContent className="max-w-[90vw] w-auto">
              {selectedImage && (
                <img 
                  src={selectedImage} 
                  alt="支付二维码" 
                  className="w-full max-w-[500px] mx-auto"
                />
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  )
}