import ar from "./ar";
import en from "./en";

export const translations = {
  ar,
  en,
};

export type Language = "en" | "ar";

export function getTranslation(lang: Language, key: string): string {
  const keys = key.split(".");
  let value: any = translations[lang];

  for (const k of keys) {
    value = value?.[k];
  }

  return value || key;
}
