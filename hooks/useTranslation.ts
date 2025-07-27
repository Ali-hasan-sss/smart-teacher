// src/hooks/useTranslation.ts
"use client";

import { useLanguage } from "@/contexts/language-context";
import { getTranslation } from "@/translations";
export function useTranslation() {
  const { language } = useLanguage();

  const t = (key: string): string => getTranslation(language, key);

  return { t, language };
}
