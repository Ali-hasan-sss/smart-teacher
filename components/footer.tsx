"use client";
import { useTranslation } from "@/hooks/useTranslation";
import { RootState } from "@/store";
import { socialLinks } from "@/utils/socialLimk";
import { AnimatePresence, motion } from "framer-motion";
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";

export default function Footer() {
  const { t } = useTranslation();
  const pathName = usePathname();
  const accountType = useSelector(
    (state: RootState) => state.auth.user?.accountType
  );
  const fastLinks = [
    { label: t("footer.fastLinks.home"), path: "/" },
    // إخفاء رابط المواد الدراسية لأولياء الأمور
    ...(accountType !== "Parent"
      ? [{ label: t("navigation.subjects"), path: "/subjects" }]
      : []),
    { label: t("footer.fastLinks.aboutUs"), path: "/about-us" },
  ];

  const supportLinks = [
    { label: t("footer.supportLinks.contact"), path: "/contact" },
    { label: t("footer.supportLinks.helpCenter"), path: "/contact" },
  ];

  return (
    <div className="relative bg-primary px-3 py-5 md:px-20 overflow-hidden rounded-t-[40px]">
      <div className="flex items-center flex-col md:flex-row md:justify-between gap-3 md:gap-10 w-full">
        <div className="absolute bottom-3 right-1/2 w-[200px] h-32 bg-white opacity-10 blur-2xl rounded-full pointer-events-none"></div>
        <div className="absolute bottom-1/3 right-1/2 w-32 h-[200px] bg-white opacity-10 blur-2xl rounded-full pointer-events-none"></div>

        <div className="flex flex-col w-full md:w-1/3 gap-5 mt-10">
          <div className="flex items-center w-24 h-24 justify-center rounded  p-1s ">
            <Image
              src={"/images/whitelogo.png"}
              height={80}
              width={80}
              alt="smart teacher"
            />
          </div>
          <p className="text-gray-300 text-lg">{t("footer.description")}</p>
          <div className="flex items-center gap-5 mt-10 z-50">
            <AnimatePresence>
              {socialLinks.map(({ href, icon: Icon }, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false }}
                  whileHover={{
                    x: [0, -5, 5, -5, 5, 0],
                    transition: {
                      duration: 0.6,
                      ease: "easeInOut",
                    },
                  }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <Link
                    href={href}
                    target="_blank"
                    className="hover:shadow-lg p-2 rounded-full"
                  >
                    <Icon className="w-8 h-8 text-white hover:text-yellow-500" />
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        <div className="flex w-full md:w-2/3  z-50 items-center justify-between px-4 md:px-10 gap-5">
          <div className="flex flex-col gap-5">
            <h2 className="text-white text-xl">
              {t("footer.fastLinks.title") || "روابط سريعة"}
            </h2>
            <ul>
              {fastLinks.map((item, index) => (
                <li key={index}>
                  <Link
                    href={item.path}
                    className={`text-lg ${
                      item.path === pathName
                        ? "text-yellow-400"
                        : "text-gray-200"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col gap-5">
            <h2 className="text-white text-xl">
              {t("footer.supportLinks.title") || "الدعم و المساعدة"}
            </h2>
            <ul>
              {supportLinks.map((item, index) => (
                <li key={index}>
                  <Link
                    href={item.path}
                    className={`text-lg ${
                      item.path === pathName
                        ? "text-yellow-400"
                        : "text-gray-200"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="w-full h-[1px] my-4 bg-white"></div>
      <div className="flex items-center justify-center w-full text-white">
        <p>{t("footer.copyright")}</p>
      </div>
    </div>
  );
}
