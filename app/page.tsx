"use client";

import { AnimatedRobot } from "@/components/animated-robot";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useTranslation } from "@/hooks/useTranslation";

export default function HomePage() {
  const { t } = useTranslation();

  return (
    <div className="  min-h-screen">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Content */}
            <div className="text-center lg:text-left rtl:lg:text-right">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
                {t("homePage.title")}
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl">
                {t("homePage.subtitle")}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start rtl:lg:justify-end">
                <Link href={`/courses`}>
                  <Button
                    size="lg"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
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
              Why Choose Smart Teacher?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Discover a new way of learning with our intelligent teaching
              platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="text-center p-6 rounded-lg bg-gray-50 dark:bg-gray-700">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🤖</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                AI-Powered Learning
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Personalized learning experience powered by artificial
                intelligence
              </p>
            </div>

            {/* Feature 2 */}
            <div className="text-center p-6 rounded-lg bg-gray-50 dark:bg-gray-700">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📚</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Interactive Courses
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Engaging and interactive courses designed for effective learning
              </p>
            </div>

            {/* Feature 3 */}
            <div className="text-center p-6 rounded-lg bg-gray-50 dark:bg-gray-700">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🌍</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Global Access
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Learn from anywhere in the world with multilingual support
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
