import { ChartLine, Lightbulb, UserSearch } from "lucide-react";
import React from "react";
interface card {
  icon: React.ReactNode;
  title: string;
  description: string;
}
export default function HowItWork() {
  const items = [
    {
      icon: <UserSearch />,
      title: " دردشة داخل الكورس",
      description: " يحلل مساعد الذكاء الاصطناعي مستواك الحالي واهتماماتك",
    },
    {
      icon: <Lightbulb />,
      title: " توصيات ذكية",
      description:
        " يقترح عليك الكورسات والمسارات التعليمية الأنسب بناءً على تحليله الدقيق",
    },
    {
      icon: <ChartLine />,
      title: "متابعة التقدم",
      description:
        " يتابع تقدمك ويعدل التوصيات باستمرار لضمان أفضل نتائج تعليمية",
    },
  ];

  const Card = ({ icon, title, description }: card) => {
    return (
      <div className="flex flex-col items-center gap-4 p-4">
        <div className="bg-secondary text-blue-400 dark:bg-third w-20 h-20 rounded-full flex items-center justify-center">
          {icon}
        </div>
        <h2 className="text-lg text-center font-bold dark:text-white">
          {title}
        </h2>
        <p className="text-sm text-center  dark:text-gray-300">{description}</p>
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center gap-5 px-1 py-10 md:px-10 mb-10 bg-white dark:bg-secondary">
      <h1 className="dark:text-white text-3xl text-center font-bold">
        كيف يعمل مساعد الذكاء الاصطناعي؟
      </h1>
      <p className="dark:text-gray-300 text-gray-700 text-lg">
        تجربة تعلم مخصصة بالكامل لاحتياجاتك
      </p>
      <div className="flex flex-col items-center gap-5 md:flex-row md:justify-between">
        {items.map((item, index) => (
          <Card
            title={item.title}
            description={item.description}
            icon={item.icon}
          />
        ))}
      </div>
    </div>
  );
}
