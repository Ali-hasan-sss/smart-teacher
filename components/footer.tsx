"use client";
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathName = usePathname();
  const fastLinks = [
    { label: "الرئيسية", path: "/" },
    { label: "الدورات", path: "/courses" },
    { label: "من نحن", path: "/about-us" },
  ];
  const supportLink = [
    { label: "تواصل معنا", path: "/contact" },
    { label: "الاسئلة الشائعة", path: "/faq" },
    { label: "مركز المساعدة", path: "/help" },
  ];
  return (
    <div className="relative bg-primary px-3 py-5 md:px-20 overflow-hidden rounded-t-[40px]">
      <div className="  flex items-center flex-col md:flex-row md:justify-between  gap-3 md:gap-10  w-full  ">
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
        <div className="absolute bottom-3 right-1/2  w-[200px] h-32 bg-white opacity-10 blur-2xl rounded-full pointer-events-none"></div>
        <div className="absolute bottom-1/3 right-1/2  w-32 h-[200px] bg-white opacity-10 blur-2xl rounded-full pointer-events-none"></div>
        <div className="flex flex-col  w-full md:w-1/3 gap-5 mt-10">
          <div className="flex items-center w-24 h-24 justify-center rounded overflow-hidden p-1s bg-white">
            <Image
              src={"/images/footerLogo.png"}
              height={100}
              width={100}
              alt="smart teacher"
            />
          </div>
          <p className="text-gray-300 text-lg ">
            منصة تعليمية متطورة تستخدم الذكاء الاصطناعي لتقديم تجربة تعلم مخصصة
            وفعالة.
          </p>
          <div className="flex text-white items-center gap-3">
            {[<Facebook />, <Instagram />, <Linkedin />, <Twitter />].map(
              (Icon, i) => (
                <div
                  key={i}
                  className="w-10 h-10 flex items-center justify-center rounded-full 
                 bg-[#374151] cursor-pointer shadow 
                 transform transition-all duration-500 ease-in-out 
                 hover:scale-110 hover:bg-gray-900"
                >
                  {Icon}
                </div>
              )
            )}
          </div>
        </div>
        <div className="flex w-full md:w-2/3 items-center justify-between px-1 md:px-10  gap-5 ">
          <div className="flex flex-col  gap-5 ">
            <h2 className="text-white text-xl">روابط سريعة</h2>
            <ul>
              {fastLinks.map((item, index) => (
                <li key={index}>
                  <Link
                    href={item.path}
                    className={` text-lg ${
                      item.path === pathName ? "text-blue-900" : "text-gray-200"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col gap-5 ">
            <h2 className="text-white  text-xl">الدعم و المساعدة</h2>
            <ul>
              {supportLink.map((item, index) => (
                <li key={index}>
                  <Link
                    href={item.path}
                    className={` text-lg ${
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
      <div className="flex items-center justify-center w-full text-white ">
        <p>© 2024 منصة التعلم الذكي. جميع الحقوق محفوظة.</p>
      </div>
    </div>
  );
}
