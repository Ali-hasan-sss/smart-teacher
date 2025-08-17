"use client";
import AboutSmart from "@/components/aboutPage/aboutSmart";
import Chat from "@/components/chat";
import Hero from "@/components/hero";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/hooks/useTranslation";
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
      title: "الجودة",
      desc: "نحرص على تقديم محتوى تعليمي عالي المستوى يلبي احتياجات المتعلمين",
      color: "blue",
    },
    {
      icon: <Lightbulb className="text-green-400" />,
      title: "الابتكار",
      desc: "نسعى دائماً لتبني أحدث التقنيات والأساليب في التعليم الحديث",
      color: "green",
    },
    {
      icon: <UsersRound className="text-red-400" />,
      title: "التفاعل",
      desc: "نؤمن بأن التعلم المثمر يحتاج إلى مشاركة وتواصل فعّال",
      color: "red",
    },
    {
      icon: <Shield className="text-red-400" />,
      title: "التمكين",
      desc: "هدفنا تمكين كل متعلم من الوصول إلى المعرفة بسهولة ويسر",
      color: "red",
    },
  ];
  const ourMession = [
    {
      icon: <Eye className="text-blue-400" />,
      title: "رؤيتنا",
      desc: " أن نصبح المنصة التعليمية الرائدة في العالم العربي، التي تلهم وتُمكّن المتعلمين من تحقيق أقصى إمكاناتهم باستخدام أحدث أدوات التكنولوجيا التعليمية. ​",
      color: "blue",
    },
    {
      icon: <Circle className="text-green-400" />,
      title: "رسالتنا",
      desc: "تقديم محتوى تعليمي موثوق، مدعوم بأدوات ذكية تساعد الطلاب على التعلم بفعالية، وتمكن المعلمين من إيصال المعرفة بأساليب مبتكرة. ​",
      color: "green",
    },
  ];
  return (
    <>
      <Hero isHome={false} />
      <Chat />
      <AboutSmart />
      <section className="flex flex-col text-center w-full items-cemter bg-third gap-5  py-10  px-2 md:px-20">
        <h1 className="text-3xl font-bold">رؤيتنا ورسالتنا</h1>
        <p className="text-sm text-gray-800 dark:text-gray-200">
          نحن في المعلم الذكي نؤمن أن المعرفة متاحة للجميع
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
      <section className="flex flex-col text-center w-full items-cemter bg-white dark:bg-primary gap-5  py-10  px-1 md:px-20">
        <h1 className="text-3xl font-bold">قيمنا الأساسية</h1>
        <p className="text-sm text-gray-800 dark:text-gray-200">
          المبادئ التي نؤمن بها ونعمل من خلالها
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
      <section className="w-full bg-primary dark:bg-third px-1 md:px-20 py-10">
        <div className="w-full flex flex-col items-center gap-5 p-5 ">
          <div
            className={`w-[50px] h-[50px] flex items-center justify-center rounded-full bg-blue-300`}
          >
            <ListTree className="text-blue-600" />
          </div>
          <h3 className="text-xl text-center text-white font-bold">
            "مع المعلم الذكي، التعلم لم يعد مهمة صعبة، بل رحلة ممتعة نحو النجاح.
          </h3>
          <div className="w-[100px] h-[2px] bg-gray-300 mt-4"></div>
        </div>
      </section>
      <section className="w-full bg-white dark:bg-secondary px-1 md:px-20 py-10">
        <div className="w-full flex flex-col items-center gap-5 p-5 ">
          <h1 className="text-3xl font-bold  text-center">
            ابدأ رحلتك التعليمية اليوم{" "}
          </h1>
          <p className={`text-sm text-center text-gray-700 dark:text-gray-300`}>
            انضم إلى آلاف الطلاب الذين يستخدمون المعلم الذكي لتحقيق أهدافهم
            التعليمية
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
    </>
  );
}
