"use client";
import { useTranslation } from "@/hooks/useTranslation";
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer() {
  const { t } = useTranslation();
  const pathName = usePathname();

  // استبدل القيم الثابتة بالترجمة مباشرة
  const fastLinks = [
    { label: t("footer.fastLinks.home"), path: "/" },
    { label: t("footer.fastLinks.courses"), path: "/courses" },
    { label: t("footer.fastLinks.aboutUs"), path: "/about-us" },
  ];

  const supportLinks = [
    { label: t("footer.supportLinks.contact"), path: "/contact" },
    { label: t("footer.supportLinks.faq"), path: "/faq" },
    { label: t("footer.supportLinks.helpCenter"), path: "/help" },
  ];

  return (
    <div className="relative bg-primary px-3 py-5 md:px-20 overflow-hidden rounded-t-[40px]">
      <div className="flex items-center flex-col md:flex-row md:justify-between gap-3 md:gap-10 w-full">
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
        <div className="absolute bottom-3 right-1/2 w-[200px] h-32 bg-white opacity-10 blur-2xl rounded-full pointer-events-none"></div>
        <div className="absolute bottom-1/3 right-1/2 w-32 h-[200px] bg-white opacity-10 blur-2xl rounded-full pointer-events-none"></div>

        <div className="flex flex-col w-full md:w-1/3 gap-5 mt-10">
          <div className="flex items-center w-24 h-24 justify-center rounded overflow-hidden p-1s bg-white">
            <Image
              src={"/images/logo.png"}
              height={100}
              width={100}
              alt="smart teacher"
            />
          </div>
          <p className="text-gray-300 text-lg">{t("footer.description")}</p>
          <div className="flex text-white items-center gap-3">
            {[Facebook, Instagram, Linkedin, Twitter].map((Icon, i) => (
              <div
                key={i}
                className="w-10 h-10 flex items-center justify-center rounded-full 
                bg-[#374151] cursor-pointer shadow 
                transform transition-all duration-500 ease-in-out 
                hover:scale-110 hover:bg-gray-900"
              >
                <Icon />
              </div>
            ))}
          </div>
        </div>

        <div className="flex w-full md:w-2/3 items-center justify-between px-1 md:px-10 gap-5">
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
                      item.path === pathName ? "text-blue-900" : "text-gray-200"
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
                      item.path === pathName ? "text-blue-900" : "text-gray-200"
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
