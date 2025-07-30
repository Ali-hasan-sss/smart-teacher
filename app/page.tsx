"use client";

import { AnimatedRobot } from "@/components/animated-robot";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useTranslation } from "@/hooks/useTranslation";
import Image from "next/image";
import { Clock, DollarSign, ScreenShare, User } from "lucide-react";

export default function HomePage() {
  const { t, language } = useTranslation();

  return (
    <div className="  min-h-screen">
      {/* Hero Section */}
      <section
        className="pt-[100px] pb-10 px-4 bg-primary relative overflow-hidden px-1 md:px-20 "
        style={{ direction: "rtl" }}
      >
        <div className="absolute top-1/2 left-2  w-32 h-32 bg-white opacity-30 blur-xl rounded-full pointer-events-none"></div>
        <div className="absolute top-1/2 right-20 w-40 h-40 bg-white opacity-50 blur-3xl rounded-full z-0 pointer-events-none"></div>
        <div className="absolute bottom-10 left-1/3 w-48 h-[300px] bg-white opacity-30 blur-3xl rounded-full pointer-events-none"></div>
        <div className="absolute top-0 left-0 w-full h-10 bg-white opacity-90 blur-2xl  pointer-events-none"></div>
        {/* icons */}
        <div className="absolute bottom-1/4 left-48 z-0 w-[40px] h-[40px] bg-[#38C7FB] rounded  hidden lg:flex items-center justify-center">
          <DollarSign className="border border-[2px] border-white rounded-full text-white" />
        </div>
        <div className="absolute top-1/4 z-1 left-20 w-[40px] h-[40px] bg-[#8047BE] rounded  hidden lg:flex  items-center justify-center">
          <Clock className="rounded-full text-white" />
        </div>
        <div className="absolute top-1/4 right-20 w-[40px] h-[40px] bg-[#3D81C2] rounded  hidden lg:flex  items-center justify-center">
          <User className="rounded-full text-white" />
        </div>
        <div className="absolute bottom-10 right-48 w-[40px] h-[40px] bg-[#007CFF] rounded  hidden lg:flex  items-center justify-center">
          <ScreenShare className="text-white" />
        </div>

        <Image
          src={"/images/leftShip.png"}
          alt="ship"
          width={300}
          height={300}
          className="absolute top-0 left-0"
        />
        <Image
          src={"/images/rihgtShip.png"}
          alt="ship"
          width={300}
          height={300}
          className="absolute bottom-0 right-0"
        />
        <div className="max-w-7xl mx-auto z-50">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Content */}
            <div className="text-center flex flex-col lg:mr-20 items-center gap-0 text-white max-w-2xl mx-auto">
              <div className="relative  w-[360px] ">
                <h1 className="text-4xl text-white font-bold leading-tight mt-6">
                  Smart Teacher
                </h1>
                <Image
                  src={"/images/smallLogo.png"}
                  alt="smallLogo"
                  className="absolute top-0 right-0"
                  width={70}
                  height={70}
                />
              </div>
              <h1 className="text-3xl font-bold leading-tight mb-6">
                {language === "ar" ? (
                  <span className="text-white">
                    تعلّم بذكاء مع{" "}
                    <span className="text-transparent px-1 bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                      الذكاء
                    </span>{" "}
                    الاصطناعي
                  </span>
                ) : (
                  <span className="text-white">
                    Learn smart with{" "}
                    <span className="text-transparent px-1 bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                      Artificial
                    </span>{" "}
                    Intelligence
                  </span>
                )}
              </h1>

              <p className="text-lg sm:text-xl text-gray-100 mb-8 leading-relaxed">
                {t("homePage.subtitle")}
              </p>

              <div className="flex justify-center">
                <Link href={`/subjects`}>
                  <Button
                    size="lg"
                    className="bg-blue-700 hover:bg-blue-600 text-white px-8 py-3 text-lg rounded-full"
                  >
                    {t("homePage.startLearning")}
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right Side - 3D Robot */}
            <div className="flex justify-center lg:justify-end rtl:lg:justify-start">
              <div className="w-full max-w-md">
                <AnimatedRobot />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {t("homePage.whyChoose")}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              {t("homePage.description")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="text-center p-6 rounded-lg bg-gray-50 dark:bg-gray-700">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🤖</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {t("homePage.aiPowered")}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {t("homePage.aiDescription")}
              </p>
            </div>

            {/* Feature 2 */}
            <div className="text-center p-6 rounded-lg bg-gray-50 dark:bg-gray-700">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📚</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {t("homePage.interactive")}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {t("homePage.interactiveDescription")}
              </p>
            </div>

            {/* Feature 3 */}
            <div className="text-center p-6 rounded-lg bg-gray-50 dark:bg-gray-700">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🌍</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {t("homePage.global")}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {t("homePage.globalDescription")}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
