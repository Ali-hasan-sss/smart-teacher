"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Download,
  Smartphone,
  Monitor,
  Star,
  CheckCircle,
  MessageCircle,
  BarChart3,
  Users,
  Award,
  Mail,
  Phone,
} from "lucide-react";
import Link from "next/link";
import { useTranslation } from "@/hooks/useTranslation";

export default function DownloadAppPage() {
  const { t } = useTranslation();

  const features = [
    {
      icon: Smartphone,
      title: t("downloadApp.features.interactive_lessons.title"),
      description: t("downloadApp.features.interactive_lessons.description"),
      color: "text-blue-500",
      bgColor: "bg-blue-100 dark:bg-blue-900/20",
    },
    {
      icon: CheckCircle,
      title: t("downloadApp.features.self_assessment.title"),
      description: t("downloadApp.features.self_assessment.description"),
      color: "text-green-500",
      bgColor: "bg-green-100 dark:bg-green-900/20",
    },
    {
      icon: BarChart3,
      title: t("downloadApp.features.performance_tracking.title"),
      description: t("downloadApp.features.performance_tracking.description"),
      color: "text-purple-500",
      bgColor: "bg-purple-100 dark:bg-purple-900/20",
    },
    {
      icon: Award,
      title: t("downloadApp.features.user_friendly.title"),
      description: t("downloadApp.features.user_friendly.description"),
      color: "text-orange-500",
      bgColor: "bg-orange-100 dark:bg-orange-900/20",
    },
    {
      icon: MessageCircle,
      title: t("downloadApp.features.direct_support.title"),
      description: t("downloadApp.features.direct_support.description"),
      color: "text-red-500",
      bgColor: "bg-red-100 dark:bg-red-900/20",
    },
    {
      icon: Users,
      title: t("downloadApp.features.available_for_all.title"),
      description: t("downloadApp.features.available_for_all.description"),
      color: "text-indigo-500",
      bgColor: "bg-indigo-100 dark:bg-indigo-900/20",
    },
  ];

  return (
    <>
      {/* Full Width Header Section */}
      <section className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-12 pt-[150px] w-full">
        <div className="container mx-auto text-center px-4">
          <div className="flex items-center justify-center mb-6">
            <div className="text-6xl mr-4">🌟</div>
            <h1 className="text-4xl font-bold">{t("downloadApp.title")}</h1>
          </div>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-4">
            {t("downloadApp.subtitle")}
          </p>
          <p className="text-lg text-blue-200 max-w-4xl mx-auto">
            {t("downloadApp.description")}
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Introduction Section */}
        <section className="mb-16">
          <Card className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border-0 shadow-xl">
            <CardContent className="p-8 md:p-12">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                  {t("downloadApp.companion_title")}
                </h2>
                <p className="text-lg text-gray-700 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
                  {t("downloadApp.companion_description")}
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Features Section */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 flex items-center justify-center gap-3">
              <span className="text-4xl">🎯</span>
              {t("downloadApp.features_title")}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
              {t("downloadApp.features_subtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-0 bg-white dark:bg-gray-800"
              >
                <CardContent className="p-6 text-center">
                  <div
                    className={`w-16 h-16 mx-auto mb-4 ${feature.bgColor} rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                  >
                    <feature.icon className={`w-8 h-8 ${feature.color}`} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Download Section */}
        <section className="mb-16">
          <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 shadow-2xl">
            <CardContent className="p-8 md:p-12 text-center">
              <div className="flex items-center justify-center mb-6">
                <Download className="w-12 h-12 mr-4" />
                <h2 className="text-3xl font-bold">
                  {t("downloadApp.download_title")}
                </h2>
              </div>
              <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                {t("downloadApp.download_subtitle")}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto mb-8">
                <a
                  href="/downloads/smart-teacher.apk"
                  download="smart-teacher.apk"
                  className="flex-1"
                >
                  <Button
                    size="lg"
                    className="w-full bg-white text-blue-600 hover:bg-gray-100 font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-3"
                  >
                    <Monitor className="w-6 h-6" />
                    <div className="text-left">
                      <div className="text-sm">
                        {t("downloadApp.android_download")}
                      </div>
                      <div className="text-xs text-gray-600">
                        {t("downloadApp.android_subtitle")}
                      </div>
                    </div>
                  </Button>
                </a>

                <Link
                  href="https://apps.apple.com/om/app/smart-teacher-%D8%A7%D9%84%D9%85%D8%B9%D9%84%D9%85-%D8%A7%D9%84%D8%B0%D9%83%D9%8A/id6748265372"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1"
                >
                  <Button
                    size="lg"
                    className="w-full bg-white text-blue-600 hover:bg-gray-100 font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-3"
                  >
                    <Smartphone className="w-6 h-6" />
                    <div className="text-left">
                      <div className="text-sm">
                        {t("downloadApp.ios_download")}
                      </div>
                      <div className="text-xs text-gray-600">
                        {t("downloadApp.ios_subtitle")}
                      </div>
                    </div>
                  </Button>
                </Link>
              </div>

              <div className="bg-white/10 rounded-lg p-4 max-w-lg mx-auto">
                <p className="text-blue-100 text-sm">
                  <strong>{t("downloadApp.note")}:</strong>{" "}
                  {t("downloadApp.note_text")}
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Target Audience Section */}
        <section className="mb-16">
          <Card className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border-0 shadow-xl">
            <CardContent className="p-8 md:p-12">
              <div className="text-center">
                <div className="flex items-center justify-center mb-6">
                  <span className="text-4xl mr-3">💡</span>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                    {t("downloadApp.target_audience_title")}
                  </h2>
                </div>
                <p className="text-lg text-gray-700 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
                  {t("downloadApp.target_audience_description")}
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Contact Section */}
        <section className="mb-16">
          <Card className="bg-white dark:bg-gray-800 shadow-xl border-0">
            <CardContent className="p-8 md:p-12">
              <div className="text-center mb-8">
                <div className="flex items-center justify-center mb-4">
                  <span className="text-4xl mr-3">📞</span>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                    {t("downloadApp.support_title")}
                  </h2>
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-lg">
                  {t("downloadApp.support_subtitle")}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                <div className="flex items-center justify-center p-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                  <Mail className="w-8 h-8 text-blue-500 mr-4" />
                  <div className="text-left">
                    <h3 className="font-bold text-gray-900 dark:text-white">
                      {t("downloadApp.email")}
                    </h3>
                    <p className="text-blue-600 dark:text-blue-400">
                      {t("downloadApp.email_address")}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-center p-6 bg-green-50 dark:bg-green-900/20 rounded-xl">
                  <Phone className="w-8 h-8 text-green-500 mr-4" />
                  <div className="text-left">
                    <h3 className="font-bold text-gray-900 dark:text-white">
                      {t("downloadApp.whatsapp")}
                    </h3>
                    <p className="text-green-600 dark:text-green-400">
                      {t("downloadApp.phone_number")}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Why Choose Smart Teacher Section */}
        <section className="mt-16 py-12 bg-gray-50 dark:bg-gray-900 rounded-2xl">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {t("downloadApp.why_choose_title")}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-3xl mx-auto px-4">
              {t("downloadApp.why_choose_subtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
            {/* Feature 1 */}
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                <Star className="w-8 h-8 text-blue-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {t("downloadApp.omani_curriculum")}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 px-2">
                {t("downloadApp.omani_curriculum_desc")}
              </p>
            </div>

            {/* Feature 2 */}
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {t("downloadApp.instant_assessment")}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 px-2">
                {t("downloadApp.instant_assessment_desc")}
              </p>
            </div>

            {/* Feature 3 */}
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center">
                <BarChart3 className="w-8 h-8 text-purple-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {t("downloadApp.comprehensive_tracking")}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 px-2">
                {t("downloadApp.comprehensive_tracking_desc")}
              </p>
            </div>

            {/* Feature 4 */}
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center">
                <Users className="w-8 h-8 text-orange-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {t("downloadApp.educational_community")}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 px-2">
                {t("downloadApp.educational_community_desc")}
              </p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
