import { Card } from "@/components/ui/card"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { useState } from "react"

export const PaymentOptions = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  return (
    <div className="space-y-8">
      <div className="border-2 border-gray-200 rounded-lg p-6">
        <div className="text-gray-700 leading-relaxed space-y-4 text-sm">
          <p>亲爱的用户，非常感谢您对我们产品的青睐与信任！若您期望获取更多此服务，烦请扫描下方二维码进行付款。<br /><br />单次服务价格为 19.9 元，若您选择 5 次服务套餐，仅需 79.9 元，性价比超高！<br /><br />在付款时，请您务必在备注栏填写您的注册邮箱，我们会在 12 小时内于后台为您迅速开通相应的服务权限，在此感谢您的选择！</p>
        </div>
      </div>

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
              <p className="mt-2 text-lg font-semibold">¥19.90/次</p>
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
                  onClick={() => setSelectedImage("/lovable-uploads/426c581c-0a3f-4603-9666-f8aac0d8a256.png")}
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
                  onClick={() => setSelectedImage("/lovable-uploads/0c247c28-3376-48b7-a94f-5db9edc21fda.png")}
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