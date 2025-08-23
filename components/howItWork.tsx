import { useTranslation } from "@/hooks/useTranslation";
import { ChartLine, Lightbulb, UserSearch } from "lucide-react";
import React from "react";
interface card {
  icon: React.ReactNode;
  title: string;
  description: string;
}
export default function HowItWork() {
  const { t } = useTranslation();
  const items = [
    {
      icon: <UserSearch />,
      title: t("howItWork.items.0.title"),
      description: t("howItWork.items.0.description"),
    },
    {
      icon: <Lightbulb />,
      title: t("howItWork.items.1.title"),
      description: t("howItWork.items.1.description"),
    },
    {
      icon: <ChartLine />,
      title: t("howItWork.items.2.title"),
      description: t("howItWork.items.2.description"),
    },
  ];

  const Card = ({ icon, title, description }: card) => {
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-4 w-[300px]">
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
    <div className="flex flex-col items-center justify-center gap-5 px-1 py-10 md:px-10 mb-10 bg-white dark:bg-secondary">
      <h1 className="dark:text-white text-3xl text-center font-bold">
        {t("howItWork.title")}
      </h1>
      <p className="dark:text-gray-300 text-gray-700 text-lg text-center">
        {t("howItWork.subtitle")}{" "}
      </p>
      <div className="flex flex-col items-center justify-center gap-5 md:flex-row ">
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
