import { MessageSquare } from "lucide-react";
import { Card } from "./ui/card";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";

export const ServiceContact = () => {
  return (
    <Card className="sticky bottom-0 left-0 right-0 p-6 bg-gradient-to-br from-primary/10 to-secondary hover:shadow-lg transition-all duration-300 max-w-full animate-fade-up">
      <div className="container mx-auto max-w-6xl">
        <div className="flex items-center gap-2 mb-4">
          <MessageSquare className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">
            My PS Mentor 客服
          </h3>
        </div>

        <div className="flex-col flex justify-center gap-8 md:flex-row">
          <div className="flex flex-col items-center gap-2 p-4 bg-white rounded-lg shadow-sm">
            <Dialog>
              <DialogTrigger asChild>
                <img
                  src="/lovable-uploads/95115651-1e7e-4608-bba5-3f0fc7142ed4.png"
                  alt="WeChat QR Code"
                  className="h-[200px] rounded-lg hover:scale-105 transition-transform duration-300 cursor-pointer"
                />
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] flex items-center justify-center p-0">
                <img
                  src="/lovable-uploads/95115651-1e7e-4608-bba5-3f0fc7142ed4.png"
                  alt="WeChat QR Code"
                  className="w-full h-auto max-h-[80vh] object-contain p-2"
                />
              </DialogContent>
            </Dialog>
            <p className="text-sm text-muted-foreground mt-2">
              关注微信公众号，后台私信
            </p>
          </div>

          <div className="flex flex-col items-center gap-2 p-4 bg-white rounded-lg shadow-sm">
            <Dialog>
              <DialogTrigger asChild>
                <img
                  src="/lovable-uploads/e1a3df74-38bb-44bc-a50a-537ad8d928cb.png"
                  alt="Xiaohongshu QR Code"
                  className="h-[200px] rounded-lg hover:scale-105 transition-transform duration-300 cursor-pointer"
                />
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] flex items-center justify-center p-0">
                <img
                  src="/lovable-uploads/e1a3df74-38bb-44bc-a50a-537ad8d928cb.png"
                  alt="Xiaohongshu QR Code"
                  className="w-full h-auto max-h-[80vh] object-contain p-2"
                />
              </DialogContent>
            </Dialog>
            <p className="text-sm text-muted-foreground mt-2">关注小红书账号，后台私信</p>
          </div>
        </div>

        <p className="text-xs text-center text-muted-foreground mt-4">
        </p>
      </div>
    </Card>
  );
};