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
  ShieldQuestion,
  LogIn,
  CreditCard,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { RootState } from "@/store";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import NotificationsDropdown from "./NotificationsDropdown";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { getAccount } from "@/store/account/accountThunks";
import ConfirmDialog from "./ConfirmDialog";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();
  const { language, setLanguage, isRTL } = useLanguage();
  const { theme, setTheme } = useTheme();
  const dispatch = useAppDispatch();
  const user = useSelector((state: RootState) => state.account.user);
  const loggedIn = useSelector(isLoggedIn);
  const [showDropdown, setShowDropdown] = useState(false);
  const [ConfirmOpen, setConfirmOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const pathname = usePathname();
  const router = useRouter();
  const accountType = useSelector(
    (state: RootState) => state.auth.user?.accountType
  );
  const handleLogout = () => {
    dispatch(logout());
    router.push("/");
    setIsOpen(false);
  };

  const navigation = [
    { name: t("navigation.home"), href: "/", icon: Home },
    ...(accountType !== "Parent"
      ? [{ name: t("navigation.subjects"), href: "/subjects", icon: BookOpen }]
      : []),
    { name: t("navigation.plans"), href: "/plans", icon: CreditCard },
    { name: t("navigation.contact"), href: "/contact", icon: Phone },
    { name: t("navigation.about"), href: "/about-us", icon: ShieldQuestion },
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
    <nav className="absolute top-0 left-0 w-full z-40">
      <div className=" mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="hidden lg:flex items-center justify-between h-20 pt-4">
          {/* وسط القائمة داخل صندوق أبيض مدور */}
          <div className="absolute left-1/2 top-2 w-[60vw] max-w-7xl transform -translate-x-1/2 mt-3 bg-third rounded-full shadow-md flex items-center justify-between px-6 py-1">
            {/* Logo and Navigation */}
            <div className="flex items-center gap-4 ">
              <Link href="/" className="flex-shrink-0">
                <Image
                  src={
                    theme === "dark"
                      ? "/images/whitelogo.png"
                      : "/images/logo.png"
                  }
                  width={theme === "dark" ? 30 : 60}
                  height={theme === "dark" ? 30 : 60}
                  alt="smart teacher"
                  className=""
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

            <div className="relative flex items-center gap-3">
              {loggedIn && user ? (
                <>
                  {/* DropdownMenu */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="flex items-center px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={user.image} alt={user.firstName} />
                          <AvatarFallback>
                            {user.firstName?.[0] || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm px-2">{user.firstName}</span>
                      </button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent className="w-48">
                      <DropdownMenuItem asChild>
                        <Link
                          href="/profile"
                          className="flex items-center gap-2 w-full text-sm"
                        >
                          <User className="w-4 h-4" />
                          {t("navigation.profile")}
                        </Link>
                      </DropdownMenuItem>

                      {accountType !== "Parent" && (
                        <DropdownMenuItem asChild>
                          <Link
                            href="/bookmarkList"
                            className="flex items-center gap-2 w-full text-sm"
                          >
                            <Bookmark className="w-4 h-4" />
                            {t("navigation.bookmarks")}
                          </Link>
                        </DropdownMenuItem>
                      )}

                      <DropdownMenuSeparator />

                      <DropdownMenuItem
                        onClick={() => setConfirmOpen(true)}
                        className="flex items-center gap-2 text-red-600 focus:bg-red-500 focus:text-white"
                      >
                        <LogOut className="w-4 h-4" />
                        {t("navigation.logout")}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {/* Notifications */}
                  <NotificationsDropdown />
                </>
              ) : (
                // زر تسجيل الدخول إذا لم يكن مسجل الدخول
                <Link
                  href="/login"
                  className="text-sm bg-blue-600 hover:bg-blue-500 text-white font-bold px-3 py-1 rounded-full"
                >
                  {t("navigation.login")}
                </Link>
              )}
            </div>
          </div>

          {/* الجزء الأيمن: اللغة والثيم والافتار */}
          <div className="flex items-center gap-2 rtl:ml-0 rtl:mr-auto ml-auto">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>

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
      <div className="lg:hidden flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-900 shadow">
        <Link href="/">
          <Image
            src={
              theme === "dark" ? "/images/whitelogo.png" : "/images/logo.png"
            }
            width={theme === "dark" ? 25 : 50}
            height={theme === "dark" ? 25 : 50}
            alt="smart teacher"
          />
        </Link>
        <div className="flex items-center gap-2">
          {loggedIn ? (
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={user?.image} alt={user?.firstName} />
                      <AvatarFallback>
                        {user?.firstName?.[0] || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent className="w-48">
                  <DropdownMenuItem asChild>
                    <Link
                      href="/profile"
                      className="flex items-center gap-2 w-full text-sm"
                    >
                      <User className="w-4 h-4" />
                      {t("navigation.profile")}
                    </Link>
                  </DropdownMenuItem>

                  {accountType !== "Parent" && (
                    <DropdownMenuItem asChild>
                      <Link
                        href="/bookmarkList"
                        className="flex items-center gap-2 w-full text-sm"
                      >
                        <Bookmark className="w-4 h-4" />
                        {t("navigation.bookmarks")}
                      </Link>
                    </DropdownMenuItem>
                  )}

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    onClick={() => setConfirmOpen(true)}
                    className="flex items-center gap-2 text-red-600 focus:bg-red-500 focus:text-white"
                  >
                    <LogOut className="w-4 h-4" />
                    {t("navigation.logout")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <NotificationsDropdown />
            </div>
          ) : (
            <></>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-8 w-8" /> : <Menu className="h-8 w-8" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="lg:hidden">
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

            {loggedIn ? (
              <>
                <Link
                  href="/profile"
                  className="flex items-center gap-2 px-4 py-2 text-base text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 "
                  onClick={() => setIsOpen(false)}
                >
                  {user?.image ? (
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
                {accountType !== "Parent" && (
                  <Link
                    href="/bookmarkList"
                    className="flex items-center gap-2 px-4 py-2 text-base text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 "
                    onClick={() => setIsOpen(false)}
                  >
                    <Bookmark className="w-5 h-5" />
                    {t("navigation.bookmarks")}
                  </Link>
                )}
                <button
                  onClick={() => {
                    setConfirmOpen(true);
                    setIsOpen(false);
                  }}
                  className="flex items-center gap-2 w-full text-left px-4 py-2 text-base text-red-600 hover:bg-red-50 dark:hover:bg-red-900 "
                >
                  <LogOut className="w-5 h-5" />
                  {t("navigation.logout")}
                </button>
              </>
            ) : (
              <div className="px-1 py-2 space-y-2">
                <Link href="/login" className="block">
                  <Button
                    variant="ghost"
                    className=" justify-start flex items-center gap-2"
                    onClick={() => setIsOpen(false)}
                  >
                    <LogIn className="w-5 h-5" />
                    {t("navigation.login")}
                  </Button>
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
                {language === "en"
                  ? t("navigation.arabic")
                  : t("navigation.english")}
              </Button>
            </div>
          </div>
        </div>
      )}
      <ConfirmDialog
        open={ConfirmOpen}
        setOpen={setConfirmOpen}
        title={t("navigation.confirm_logout")}
        message={t("navigation.confirm_logout_message")}
        confirmText={t("navigation.yes")}
        cancelText={t("navigation.cancel")}
        onConfirm={handleLogout}
      />
    </nav>
  );
}
