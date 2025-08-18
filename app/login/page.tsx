"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoginForm from "./loginform";
import RegisterForm from "./RegisterForm";
import { useTranslation } from "@/hooks/useTranslation";

export default function Test() {
  const { t } = useTranslation();
  return (
    <div className="flex items-center justify-center py-20 md:pt-[100px]  md:p-4">
      <div className=" flex w-full items-center justify-center max-w-4xl rounded-xl">
        <div className="w-full md:w-3/4  flex flex-col justify-center ">
          <div className=" rounded-xl ">
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid grid-cols-2 dark:bg-gray-700">
                <TabsTrigger value="login"> {t("auth.loginTitle")}</TabsTrigger>
                <TabsTrigger value="register">
                  {t("auth.registerTitle")}
                </TabsTrigger>
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
