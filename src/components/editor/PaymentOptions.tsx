import { Card } from "@/components/ui/card"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { useState } from "react"

export const PaymentOptions = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  return (
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
                onClick={() => setSelectedImage("/lovable-uploads/bc1db9f3-a61f-49b7-bd7f-240a3e196786.png")}
              />
            </DialogTrigger>
            <p className="mt-2 text-lg font-semibold">¥19.90</p>
          </Card>
          <Card className="p-4 flex flex-col items-center">
            <DialogTrigger asChild>
              <img 
                src="/lovable-uploads/36d54d5d-d91a-49e8-b85d-340014a5ac97.png" 
                alt="支付宝支付 ¥79.90" 
                className="w-full max-w-[240px] rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => setSelectedImage("/lovable-uploads/36d54d5d-d91a-49e8-b85d-340014a5ac97.png")}
              />
            </DialogTrigger>
            <p className="mt-2 text-lg font-semibold">¥79.90</p>
          </Card>
          <DialogContent className="max-w-[90vw] w-auto">
            {selectedImage && (
              <img 
                src={selectedImage} 
                alt="支付宝支付二维码" 
                className="w-full max-w-[500px] mx-auto"
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}