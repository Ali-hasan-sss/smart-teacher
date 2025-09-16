"use client";
import AboutSmart from "@/components/aboutPage/aboutSmart";
import Chat from "@/components/chat";
import Hero from "@/components/hero";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/hooks/useTranslation";
import { AnimatePresence, motion } from "framer-motion";
import {
  Award,
  Circle,
  Eye,
  Lightbulb,
  ListTree,
  Shield,
  UsersRound,
} from "lucide-react";
import Link from "next/link";

export default function About() {
  const { t } = useTranslation();
  const ourValue = [
    {
      icon: <Award className="text-blue-400" />,
      title: t("about.quality"),
      desc: t("about.quality_desc"),
      color: "blue",
    },
    {
      icon: <Lightbulb className="text-green-400" />,
      title: t("about.innovation"),
      desc: t("about.innovation_desc"),
      color: "green",
    },
    {
      icon: <UsersRound className="text-red-400" />,
      title: t("about.interaction"),
      desc: t("about.interaction_desc"),
      color: "red",
    },
    {
      icon: <Shield className="text-red-400" />,
      title: t("about.empowerment"),
      desc: t("about.empowerment_desc"),
      color: "red",
    },
  ];
  const ourMession = [
    {
      icon: <Eye className="text-blue-400" />,
      title: t("about.vision"),
      desc: t("about.vision_desc"),
      color: "blue",
    },
    {
      icon: <Circle className="text-green-400" />,
      title: t("about.mission"),
      desc: t("about.mission_desc"),
      color: "green",
    },
  ];
  return (
    <>
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: "easeOut" }}
        >
          <Hero isHome={false} />
        </motion.div>
        <Chat />
        <AboutSmart />
        <motion.div
          className="flex-1 bg-third rounded-lg shadow-lg p-6"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
        >
          <section className="flex flex-col text-center w-full items-cemter bg-third gap-5  py-10  px-2 md:px-20">
            <h1 className="text-3xl font-bold">{t("about.our_mession")}</h1>
            <p className="text-sm text-gray-800 dark:text-gray-200">
              {t("about.ourmession_desc")}
            </p>
            <div className="flex flex-col md:flex-row items-center justify-center gap-2">
              {ourMession.map((item, idx) => (
                <div
                  className="w-full md:w-1/2 flex flex-col items-start gap-2 bg-white dark:bg-primary p-5 rounded-lg"
                  key={idx}
                >
                  <div
                    className={`w-[50px] h-[50px] flex items-center justify-center rounded-full bg-${item.color}-50`}
                  >
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-bold">{item.title}</h3>
                  <p className="text-sm text-start text-gray-700 dark:text-gray-300">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </motion.div>
        <motion.div
          className="flex-1 bg-third rounded-lg shadow-lg p-6"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
        >
          <section className="flex flex-col text-center w-full items-cemter bg-white dark:bg-primary gap-5  py-10  px-1 md:px-20">
            <h1 className="text-3xl font-bold">{t("about.core_values")}</h1>
            <p className="text-sm text-gray-800 dark:text-gray-200">
              {t("about.core_values_desc")}
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {ourValue.map((item, idx) => (
                <div
                  key={idx}
                  className="flex flex-col items-center gap-2 bg-white dark:bg-primary p-5 rounded-lg"
                >
                  <div
                    className={`w-[50px] h-[50px] flex items-center justify-center rounded-full bg-${item.color}-50`}
                  >
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-bold">{item.title}</h3>
                  <p className="text-sm text-center text-gray-700 dark:text-gray-300">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: "easeOut" }}
        >
          <section className="w-full bg-primary dark:bg-third px-1 md:px-20 py-10">
            <div className="w-full flex flex-col items-center gap-5 p-5 ">
              <div
                className={`w-[50px] h-[50px] flex items-center justify-center rounded-full bg-blue-300`}
              >
                <ListTree className="text-blue-600" />
              </div>
              <h3 className="text-xl text-center text-white font-bold">
                "{t("about.quote")}"
              </h3>
              <div className="w-[100px] h-[2px] bg-gray-300 mt-4"></div>
            </div>
          </section>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: "easeOut" }}
        >
          <section className="w-full bg-white dark:bg-secondary px-1 md:px-20 py-10">
            <div className="w-full flex flex-col items-center gap-5 p-5 ">
              <h1 className="text-3xl font-bold  text-center">
                {t("about.start_journey")}
              </h1>
              <p
                className={`text-sm text-center text-gray-700 dark:text-gray-300`}
              >
                {t("about.join_students")}
              </p>
              <div className="flex justify-center">
                <Link href={`/subjects`}>
                  <Button
                    size="lg"
                    className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 text-lg rounded-full"
                  >
                    {t("homePage.startLearning")}
                  </Button>
                </Link>
              </div>
            </div>
          </section>
        </motion.div>
      </AnimatePresence>
    </>
  );
}
