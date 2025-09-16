"use client";

import { useTranslation } from "@/hooks/useTranslation";
import { socialLinks } from "@/utils/socialLimk";
import { AnimatePresence, motion } from "framer-motion";
import { ListTree, Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";

export default function ContactPage() {
  const { t } = useTranslation();

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, ease: "easeOut" }}
      >
        <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-secondary">
          {/* العنوان */}
          <section className="bg-primary text-white py-12 pt-[150px]">
            <div className="container mx-auto text-center">
              <h1 className="text-3xl font-bold mb-4">
                {t("contact.contact_us")}
              </h1>
              <p className="text-lg max-w-2xl mx-auto">
                {t("contact.description")}
              </p>
            </div>
          </section>
          {/* النموذج ومعلومات التواصل */}

          <section className="container  mx-auto px-4 py-12 flex flex-col md:flex-row gap-8">
            {/* نموذج المراسلة */}
            <motion.div
              className="flex-1 bg-third rounded-lg shadow-lg p-6"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.9, ease: "easeOut" }}
            >
              <div>
                <h2 className="text-xl dark:text-white font-bold mb-4">
                  {t("contact.send_message")}
                </h2>
                <form className="space-y-4">
                  <input
                    type="text"
                    placeholder={t("contact.full_name")}
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="email"
                    placeholder={t("contact.email")}
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <textarea
                    placeholder={t("contact.whrite_message")}
                    rows={5}
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  ></textarea>
                  <button
                    type="button"
                    onClick={() => console.log("contact")}
                    className="w-full bg-blue-700 text-white py-2 rounded-lg hover:bg-blue-600 transition"
                  >
                    {t("contact.send")}
                  </button>
                </form>
              </div>
            </motion.div>

            {/* وسائل التواصل */}
            <motion.div
              className="flex-1 bg-primary text-white rounded-lg shadow-lg p-6 flex flex-col justify-center"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.9, ease: "easeOut" }}
            >
              <div>
                <h2 className="text-xl font-bold mb-4">
                  {t("contact.social_media")}
                </h2>
                <ul className="space-y-4">
                  <li className="flex items-center gap-3">
                    <Phone className="w-5 h-5" />
                    <span>{t("contact.phone_number")}</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Mail className="w-5 h-5" />
                    <span>{t("contact.email_address")}</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <MapPin className="w-5 h-5" />
                    <span>{t("contact.location")}</span>
                  </li>
                </ul>

                {/* أيقونات السوشال ميديا */}
                <div className="flex items-center gap-5 mt-10">
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
                          key={index}
                          href={href}
                          target="_blank"
                          className="transition-transform transform hover:scale-110 hover:shadow-lg p-2 rounded-full"
                        >
                          <Icon className="w-8 h-8 hover:text-yellow-500" />
                        </Link>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          </section>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            exit={{
              opacity: 0,
            }}
          >
            <section className="w-full bg-primary dark:bg-third px-1 md:px-20 py-5 my-5">
              <div className="w-full flex flex-col items-center gap-5 p-5 ">
                <div
                  className={`w-[50px] h-[50px] flex items-center justify-center rounded-full bg-blue-300`}
                >
                  <ListTree className="text-blue-600" />
                </div>
                <h3 className="text-xl text-center text-white font-bold">
                  {t("contact.cta")}
                </h3>
                <div className="w-[100px] h-[2px] bg-gray-300 mt-4"></div>
              </div>
            </section>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
