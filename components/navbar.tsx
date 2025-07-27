"use client";

import { useState } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useSelector } from "react-redux";
import { logout } from "@/store/auth/authSlice";
import { useLanguage } from "@/contexts/language-context";
import { useTranslation } from "@/hooks/useTranslation";
import { Button } from "@/components/ui/button";
import { Menu, X, Sun, Moon, Globe, LogOut, User } from "lucide-react";
import { useAppDispatch } from "@/store/hooks";
import { RootState } from "@/store";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();
  const { language, setLanguage, isRTL } = useLanguage();
  const { theme, setTheme } = useTheme();
  const dispatch = useAppDispatch();

  const user = useSelector((state: RootState) => state.auth.user);

  const handleLogout = () => {
    dispatch(logout());
    setIsOpen(false);
  };

  const navigation = [
    { name: t("navigation.home"), href: "/" },
    { name: t("navigation.courses"), href: "/courses" },
    { name: t("navigation.contact"), href: "/contact" },
  ];

  const toggleLanguage = () => {
    const newLang = language === "en" ? "ar" : "en";
    setLanguage(newLang);
  };

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0">
              <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                Smart Teacher
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div
            className={`hidden md:flex items-center space-x-3 ${
              isRTL ? "space-x-reverse" : ""
            }`}
          >
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 text-sm font-medium transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div
            className={`hidden md:flex items-center space-x-4 ${
              isRTL ? "space-x-reverse" : ""
            }`}
          >
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>

            {/* Language Toggle */}
            <Button variant="ghost" size="icon" onClick={toggleLanguage}>
              <Globe className="h-5 w-5" />
            </Button>

            {/* Auth Actions */}
            {user ? (
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span className="text-sm">{user.firstName}</span>
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-1" />
                  {t("navigation.logout")}
                </Button>
              </div>
            ) : (
              <div
                className={`flex space-x-2 ${isRTL ? "space-x-reverse" : ""}`}
              >
                <Link href="/login">
                  <Button variant="ghost">{t("navigation.login")}</Button>
                </Link>
                <Link href="/register">
                  <Button>{t("navigation.register")}</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white dark:bg-gray-900 border-t dark:border-gray-700">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 block px-3 py-2 text-base font-medium"
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}

            <div className="flex items-center justify-between px-3 py-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              >
                <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 mr-2" />
                <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 mr-2" />
              </Button>

              <Button variant="ghost" size="sm" onClick={toggleLanguage}>
                <Globe className="h-4 w-4 mr-2" />
                {language === "en" ? "العربية" : "English"}
              </Button>
            </div>

            {user ? (
              <Button
                variant="ghost"
                className="w-full justify-start px-3"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                {t("navigation.logout")}
              </Button>
            ) : (
              <div className="px-3 py-2 space-y-2">
                <Link href="/login" className="block">
                  <Button variant="ghost" className="w-full justify-start">
                    {t("navigation.login")}
                  </Button>
                </Link>
                <Link href="/register" className="block">
                  <Button className="w-full">{t("navigation.register")}</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
