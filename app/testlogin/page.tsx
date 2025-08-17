import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoginForm from "./loginform";
import RegisterForm from "./RegisterForm";

export default function Test() {
  return (
    <div
      dir="rtl"
      className="min-h-screen flex items-center justify-center py-20 md:py-[100px] bg-secondary md:p-4"
    >
      <div className="relative flex w-full max-w-4xl rounded-xl">
        <div className="hidden md:block md:w-1/2">
          <img
            src="/images/loginPlaceholder.png"
            alt="Auth illustration"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="w-full md:w-3/4 md:absolute top-6 left-0 flex flex-col justify-center md:h-[80vh]">
          <div className="bg-white dark:bg-gray-500 p-3 rounded-xl overflow-y-auto">
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid grid-cols-2">
                <TabsTrigger value="login">تسجيل الدخول</TabsTrigger>
                <TabsTrigger value="register">إنشاء حساب جديد</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <LoginForm />
              </TabsContent>

              <TabsContent value="register">
                <RegisterForm />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
