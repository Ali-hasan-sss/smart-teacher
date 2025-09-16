"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoginForm from "./loginform";
import RegisterForm from "./RegisterForm";
import { useTranslation } from "@/hooks/useTranslation";
import { AnimatePresence, motion } from "framer-motion";

export default function AuthTabs() {
  const { t } = useTranslation();

  const [currentTab, setCurrentTab] = useState<"login" | "register">("login");

  const [registerDefaults, setRegisterDefaults] = useState<
    Partial<{
      email: string;
      firstName: string;
      lastName: string;
      phoneNumber: string;
    }>
  >({});

  const switchTab = (tab: "login" | "register") => {
    setCurrentTab(tab);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
      >
        <div className="flex items-center justify-center py-[100px] md:pt-[100px] md:p-4">
          <div className="flex w-full items-center justify-center max-w-4xl rounded-xl">
            <div className="w-full md:w-3/4 flex flex-col justify-center">
              <div className="rounded-xl">
                <Tabs
                  value={currentTab}
                  onValueChange={(val) =>
                    setCurrentTab(val as "login" | "register")
                  }
                  className="w-full"
                >
                  <TabsList className="grid grid-cols-2 dark:bg-gray-700">
                    <TabsTrigger value="login">
                      {t("auth.loginTitle")}
                    </TabsTrigger>
                    <TabsTrigger value="register">
                      {t("auth.registerTitle")}
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="login" className="mt-0">
                    <motion.div
                      initial={{ opacity: 0, x: -50 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: false, amount: 0.3 }}
                      transition={{ duration: 0.9, ease: "easeOut" }}
                    >
                      <LoginForm
                        switchTab={switchTab}
                        setRegisterDefaults={setRegisterDefaults}
                      />
                    </motion.div>
                  </TabsContent>

                  <TabsContent value="register" className="mt-0">
                    <motion.div
                      initial={{ opacity: 0, x: -50 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: false, amount: 0.3 }}
                      transition={{ duration: 0.9, ease: "easeOut" }}
                    >
                      <RegisterForm
                        defaults={registerDefaults}
                        switchTab={switchTab}
                      />
                    </motion.div>{" "}
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
