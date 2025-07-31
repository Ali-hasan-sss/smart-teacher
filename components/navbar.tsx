"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useSelector } from "react-redux";
import { isLoggedIn, logout } from "@/store/auth/authSlice";
import { useLanguage } from "@/contexts/language-context";
import { useTranslation } from "@/hooks/useTranslation";
import { Button } from "@/components/ui/button";
import {
  Menu,
  X,
  Sun,
  Moon,
  Globe,
  LogOut,
  User,
  Bookmark,
  Home,
  BookOpen,
  Phone,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { RootState } from "@/store";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { usePathname, useRouter } from "next/navigation";
import { getAccount } from "@/store/account/accountSlice";
import Image from "next/image";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();
  const { language, setLanguage, isRTL } = useLanguage();
  const { theme, setTheme } = useTheme();
  const dispatch = useAppDispatch();
  const user = useSelector((state: RootState) => state.account.user);
  const IsLoggedIn = useAppSelector(isLoggedIn);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    dispatch(logout());
    router.push("/");
    setIsOpen(false);
  };

  const navigation = [
    { name: t("navigation.home"), href: "/", icon: Home },
    { name: t("navigation.subjects"), href: "/subjects", icon: BookOpen },
    { name: t("navigation.contact"), href: "/contact", icon: Phone },
  ];
  useEffect(() => {
    dispatch(getAccount());
  }, [dispatch]);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleLanguage = () => {
    const newLang = language === "en" ? "ar" : "en";
    setLanguage(newLang);
  };

  return (
    <nav className="absolute top-0 left-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="hidden md:flex items-center justify-between h-20 pt-4">
          {/* وسط القائمة داخل صندوق أبيض مدور */}
          <div className="absolute left-1/2 top-2 w-[60vw] max-w-7xl transform -translate-x-1/2 mt-3 bg-white dark:bg-secondary rounded-full shadow-md flex items-center justify-between px-6 py-1">
            {/* Logo and Navigation */}
            <div className="flex items-center gap-4 ">
              <Link href="/" className="flex-shrink-0">
                <Image
                  src="/images/logo.png"
                  width={40}
                  height={40}
                  alt="smart teacher"
                  className="bg-gray-100 rounded-full "
                />
              </Link>
              <div className="flex items-center gap-2 ">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`text-sm font-medium text-gray-800 hover:bg-blue-50 dark:hover:text-gray-800 dark:text-white px-3 py-1 rounded-full transition ${
                      pathname === item.href
                        ? "bg-blue-600 font-bold text-white hover:text-gray-800"
                        : " "
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Avatar / Auth Actions */}
            <div
              className="flex items-center gap-2 rtl:flex-row-reverse"
              ref={dropdownRef}
            >
              {IsLoggedIn && user ? (
                <div className="relative">
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="flex items-center px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition"
                  >
                    <Avatar className="w-7 h-7">
                      <AvatarImage src={user.image} alt={user.firstName} />
                      <AvatarFallback>
                        {user.firstName?.[0] || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm px-2">{user.firstName}</span>
                  </button>

                  {showDropdown && (
                    <div className="absolute ltr:right-0 rtl:left-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-2 z-50">
                      <Link
                        href="/profile"
                        className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => setShowDropdown(false)}
                      >
                        <User className="w-4 h-4" />
                        {t("navigation.profile")}
                      </Link>
                      <Link
                        href="/bookmarkList"
                        className="flex items-center gap-2 px-3 py-1 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => setShowDropdown(false)}
                      >
                        <Bookmark className="w-4 h-4" />
                        {t("navigation.bookmarks")}
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-red-600 hover:text-white hover:bg-red-500"
                      >
                        <LogOut className="w-4 h-4" />
                        {t("navigation.logout")}
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex gap-2 rtl:flex-row-reverse">
                  <Link
                    href="/login"
                    className={`text-sm text-center bg-blue-600 hover:bg-blue-500  text-white font-bold w-[130px] px-3 py-1 rounded-full transition ${
                      pathname === "/login"
                        ? "bg-blue-500 text-white font-bold"
                        : ""
                    }`}
                  >
                    {t("navigation.login")}
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* الجزء الأيمن: اللغة والثيم والافتار */}
          <div className="flex items-center gap-2 rtl:ml-0 rtl:mr-auto ml-auto">
            {/* زر الثيم */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>

            {/* زر اللغة */}
            <Button
              variant="ghost"
              className="px-1"
              size="icon"
              onClick={toggleLanguage}
            >
              <Globe className="h-5 w-5" />
              {language}
            </Button>
          </div>
        </div>
      </div>

      {/* موبايل */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-900 shadow">
        <Link href="/">
          <Image
            src={"/images/logo.png"}
            width={36}
            height={36}
            alt="smart teacher"
          />
        </Link>
        <div className="flex items-center gap-2">
          {IsLoggedIn ? (
            user && user.image ? (
              <Avatar className="w-6 h-6">
                <AvatarImage src={user.image} alt={user.firstName} />
                <AvatarFallback>{user.firstName?.[0] || "U"}</AvatarFallback>
              </Avatar>
            ) : (
              <User className="w-5 h-5" />
            )
          ) : (
            <></>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white dark:bg-gray-900 border-t dark:border-gray-700">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 block px-3 py-2 text-base font-medium rounded-md ${
                    pathname === item.href
                      ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-bold"
                      : ""
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  <Icon size={18} />
                  {item.name}
                </Link>
              );
            })}

            {IsLoggedIn ? (
              <>
                <Link
                  href="/profile"
                  className="flex items-center gap-2 px-4 py-2 text-base text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 "
                  onClick={() => setIsOpen(false)}
                >
                  {user.image ? (
                    <Avatar className="w-6 h-6">
                      <AvatarImage src={user.image} alt={user.firstName} />
                      <AvatarFallback>
                        {user.firstName?.[0] || "U"}
                      </AvatarFallback>
                    </Avatar>
                  ) : (
                    <User className="w-5 h-5" />
                  )}
                  {t("navigation.profile")}
                </Link>
                <Link
                  href="/bookmarkList"
                  className="flex items-center gap-2 px-4 py-2 text-base text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 "
                  onClick={() => setIsOpen(false)}
                >
                  <Bookmark className="w-5 h-5" />
                  {t("navigation.bookmarks")}
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="flex items-center gap-2 w-full text-left px-4 py-2 text-base text-red-600 hover:bg-red-50 dark:hover:bg-red-900 "
                >
                  <LogOut className="w-5 h-5" />
                  {t("navigation.logout")}
                </button>
              </>
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
            <div className="flex  items-center justify-between  px-3 py-2">
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
          </div>
        </div>
      )}
    </nav>
  );
}
