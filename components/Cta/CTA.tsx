import Link from "next/link";
import { Button } from "../ui/button";
import { useTranslation } from "@/hooks/useTranslation";
import { motion } from "framer-motion";

export default function CTA() {
  const { t } = useTranslation();
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.3 }}
      transition={{ duration: 0.9, ease: "easeOut" }}
      exit={{
        opacity: 0,
      }}
    >
      <div className="flex flex-col rounded-[20px] px-1 md:px-10 py-10 items-center justify-center gap-10 bg-cta">
        <h3 className="text-xl font-bold text-center">{t("cta.title")}</h3>
        <p className="text-lg text-center text-gray-300">
          {t("cta.description")}
        </p>
        <Link href={"/subjects"}>
          <Button className="rounded-full py-4 px-5 text-white w-[150px]">
            {t("cta.button")}
          </Button>
        </Link>
      </div>
    </motion.div>
  );
}
