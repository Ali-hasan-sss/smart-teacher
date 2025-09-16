import { useTranslation } from "@/hooks/useTranslation";
import { ChartLine, Lightbulb, UserSearch } from "lucide-react";
import React from "react";
import { motion } from "framer-motion";

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
      <div className="flex flex-wrap items-center justify-center gap-5 ">
        {items.map((item, index) => {
          let initialPosition = { opacity: 0, y: 50, x: 0 };

          if (index % 3 === 0) {
            initialPosition = { opacity: 0, x: -50, y: 0 };
          } else if (index % 3 === 1) {
            initialPosition = { opacity: 0, y: 50, x: 0 };
          } else {
            initialPosition = { opacity: 0, x: 50, y: 0 };
          }

          return (
            <motion.div
              key={index}
              initial={initialPosition}
              whileInView={{ opacity: 1, x: 0, y: 0 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              exit={{ opacity: 0, y: -50 }}
            >
              <Card
                title={item.title}
                description={item.description}
                icon={item.icon}
              />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
