"use client";

import { setUser } from "@/store/auth/authSlice";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useDispatch } from "react-redux";

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
  const [language, setLanguageState] = useState<Language | null>("ar");
  const dispatch = useDispatch();

  useEffect(() => {
    if (typeof window === "undefined") return;
    const userJson = localStorage.getItem("user");
    if (userJson) {
      try {
        const user = JSON.parse(userJson);
        dispatch(setUser(user));
      } catch (err) {
        console.error("Failed to parse user from localStorage:", err);
      }
    }
  }, [dispatch]);

  const setLanguage = (lang: Language) => {
    localStorage.setItem("lang", lang);
    setLanguageState(lang);
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    const savedLang = localStorage.getItem("lang") as Language;
    if (savedLang) setLanguageState(savedLang);
  }, []);

  // تغيير اتجاه الموقع بناءً على اللغة
  useEffect(() => {
    if (language) {
      document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
      document.documentElement.lang = language;
    }
  }, [language]);

  if (language === null) return null;

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
