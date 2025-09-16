import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";
import { useTranslation } from "@/hooks/useTranslation";
import { motion } from "framer-motion";

export default function AboutSmart() {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col md:flex-row items-center gap-5 md:justify-between px-1 py-5 md:py-20 md:px-20 bg-white dark:bg-primary">
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
      >
        <div className="flex flex-col gap-3 w-full items-center md:items-start md:w-1/2 ">
          <div className="flex items-center gap-2">
            <Image
              src={"/images/greenLogo.png"}
              alt="logo"
              width={30}
              height={30}
            />
            <h2 className="text-primary dark:text-white font-bold text-3xl">
              {t("about.about_smart")}
            </h2>
          </div>{" "}
          <p className="text-lg text-gray-700 dark:text-gray-200">
            {t("about.description")}
          </p>
          <Link href={`/subjects`}>
            <Button
              size="lg"
              className="bg-blue-700 hover:bg-blue-600 text-white px-8 py-3 text-lg rounded-full"
            >
              {t("homePage.startLearning")}
            </Button>
          </Link>
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
      >
        <div className="flex flex-col relative gap-3 w-[350px] ">
          <Image
            src={"/images/person.png"}
            width={300}
            height={300}
            alt="abutus"
            className="z-10"
          />
          <div className="absolute z-0 top-10 left-1 w-[250px] h-3/4 bg-primary dark:bg-secondary rounded-lg"></div>
        </div>
      </motion.div>
    </div>
  );
}
