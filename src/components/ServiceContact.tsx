import { QrCode, MessageSquare } from "lucide-react";
import { Card } from "./ui/card";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "./ui/dialog";

export const ServiceContact = () => {
  return (
    <Card className="sticky bottom-0 left-0 right-0 p-6 bg-gradient-to-br from-primary/10 to-secondary hover:shadow-lg transition-all duration-300 max-w-full animate-fade-up">
      <div className="container mx-auto max-w-6xl">
        <div className="flex items-center gap-2 mb-4">
          <MessageSquare className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Dr. PS Checker 客服</h3>
        </div>
        
        <div className="flex justify-center gap-8">
          <div className="flex flex-col items-center gap-2 p-4 bg-white rounded-lg shadow-sm">
            <Dialog>
              <DialogTrigger asChild>
                <img
                  src="/lovable-uploads/19c3bccf-32ed-4206-84e5-f130627442c9.png"
                  alt="WeChat QR Code"
                  className="w-[200px] h-[200px] rounded-lg hover:scale-105 transition-transform duration-300 cursor-pointer"
                />
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] flex items-center justify-center p-0">
                <img
                  src="/lovable-uploads/19c3bccf-32ed-4206-84e5-f130627442c9.png"
                  alt="WeChat QR Code"
                  className="w-full h-auto max-h-[80vh] object-contain p-2"
                />
              </DialogContent>
            </Dialog>
            <p className="text-sm text-muted-foreground mt-2">扫码添加微信客服</p>
          </div>
          
          <div className="flex flex-col items-center gap-2 p-4 bg-white rounded-lg shadow-sm">
            <Dialog>
              <DialogTrigger asChild>
                <img
                  src="/lovable-uploads/d433049a-11c6-4d35-9604-75f338cb1690.png"
                  alt="Xiaohongshu QR Code"
                  className="w-[200px] h-[200px] rounded-lg hover:scale-105 transition-transform duration-300 cursor-pointer"
                />
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] flex items-center justify-center p-0">
                <img
                  src="/lovable-uploads/d433049a-11c6-4d35-9604-75f338cb1690.png"
                  alt="Xiaohongshu QR Code"
                  className="w-full h-auto max-h-[80vh] object-contain p-2"
                />
              </DialogContent>
            </Dialog>
            <p className="text-sm text-muted-foreground mt-2">关注小红书账号</p>
          </div>
        </div>

        <p className="text-xs text-center text-muted-foreground mt-4">
          工作时间：周一至周日 9:00-22:00
        </p>
      </div>
    </Card>
  );
};