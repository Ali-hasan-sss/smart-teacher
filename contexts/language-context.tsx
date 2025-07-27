"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

export type Language = "en" | "ar";

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  isRTL: boolean;
};

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language | null>(null);

  const setLanguage = (lang: Language) => {
    localStorage.setItem("lang", lang);
    setLanguageState(lang);
  };

  useEffect(() => {
    const savedLang = localStorage.getItem("lang") as Language;
    setLanguageState(savedLang || "ar");
  }, []);

  if (language === null) return null; // ✅ تجنب التصيير حتى تحديد اللغة

  const isRTL = language === "ar";

  return (
    <LanguageContext.Provider value={{ language, setLanguage, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context)
    throw new Error("useLanguage must be used within LanguageProvider");
  return context;
};
