import { getRequestConfig } from "next-intl/server";

export default getRequestConfig(async ({ locale }) => {
  // تأكد من وجود locale أو استخدم قيمة افتراضية
  const currentLocale = locale ?? "en";

  const messages = await import(`../messages/${currentLocale}.json`).then(
    (mod) => mod.default
  );

  return {
    locale: currentLocale, // هنا نوع string فقط
    messages,
  };
});
