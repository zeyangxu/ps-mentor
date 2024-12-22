import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EmailAuthForm } from "./EmailAuthForm";
import { PhoneAuthForm } from "./PhoneAuthForm";

export function AuthForm() {
  return (
    <Tabs defaultValue="email" className="w-full">
      <TabsList className="grid w-full grid-cols-2 mb-4">
        <TabsTrigger value="email">邮箱登录</TabsTrigger>
        <TabsTrigger value="phone">手机登录</TabsTrigger>
      </TabsList>

      <TabsContent value="email">
        <EmailAuthForm />
      </TabsContent>

      <TabsContent value="phone">
        <PhoneAuthForm />
      </TabsContent>
    </Tabs>
  );
}