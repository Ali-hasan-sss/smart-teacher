"use client"

import type React from "react"

import { useState } from "react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Sun, Moon, Globe, User, LogOut, Menu, X, Eye, EyeOff } from "lucide-react"

// Simple translation system
const translations = {
  en: {
    title: "Welcome to Smart Teacher",
    subtitle: "Learn smarter, not harder with AI-powered education",
    startLearning: "Start Learning",
    login: "Login",
    register: "Register",
    logout: "Logout",
    home: "Home",
    courses: "Courses",
    about: "About",
    contact: "Contact",
    loginTitle: "Login to Your Account",
    registerTitle: "Create New Account",
    email: "Email",
    password: "Password",
    confirmPassword: "Confirm Password",
    firstName: "First Name",
    lastName: "Last Name",
    loginButton: "Login",
    registerButton: "Register",
    dontHaveAccount: "Don't have an account?",
    alreadyHaveAccount: "Already have an account?",
    registerHere: "Register here",
    loginHere: "Login here",
    whyChoose: "Why Choose Smart Teacher?",
    aiPowered: "AI-Powered Learning",
    interactive: "Interactive Courses",
    global: "Global Access",
  },
  ar: {
    title: "مرحباً بك في المعلم الذكي",
    subtitle: "تعلم بذكاء، وليس بجهد أكبر مع التعليم المدعوم بالذكاء الاصطناعي",
    startLearning: "ابدأ التعلم",
    login: "تسجيل الدخول",
    register: "إنشاء حساب",
    logout: "تسجيل الخروج",
    home: "الرئيسية",
    courses: "الدورات",
    about: "حول",
    contact: "اتصل بنا",
    loginTitle: "تسجيل الدخول إلى حسابك",
    registerTitle: "إنشاء حساب جديد",
    email: "البريد الإلكتروني",
    password: "كلمة المرور",
    confirmPassword: "تأكيد كلمة المرور",
    firstName: "الاسم الأول",
    lastName: "اسم العائلة",
    loginButton: "تسجيل الدخول",
    registerButton: "إنشاء حساب",
    dontHaveAccount: "ليس لديك حساب؟",
    alreadyHaveAccount: "هل لديك حساب بالفعل؟",
    registerHere: "أنشئ حساباً هنا",
    loginHere: "سجل الدخول هنا",
    whyChoose: "لماذا تختار المعلم الذكي؟",
    aiPowered: "التعلم بالذكاء الاصطناعي",
    interactive: "دورات تفاعلية",
    global: "وصول عالمي",
  },
}

// Simple 3D Robot Component
function SimpleRobot() {
  return (
    <div className="w-full h-96 flex items-center justify-center">
      <div className="relative animate-bounce">
        {/* Robot Body */}
        <div className="w-24 h-32 bg-blue-600 rounded-lg relative">
          {/* Robot Head */}
          <div className="w-20 h-16 bg-blue-400 rounded-lg absolute -top-8 left-2">
            {/* Eyes */}
            <div className="flex justify-between px-3 pt-4">
              <div className="w-3 h-3 bg-blue-900 rounded-full animate-pulse"></div>
              <div className="w-3 h-3 bg-blue-900 rounded-full animate-pulse"></div>
            </div>
          </div>

          {/* Arms */}
          <div className="w-4 h-16 bg-blue-600 rounded absolute -left-6 top-4 animate-pulse"></div>
          <div className="w-4 h-16 bg-blue-600 rounded absolute -right-6 top-4 animate-pulse"></div>

          {/* Legs */}
          <div className="w-6 h-12 bg-blue-800 rounded absolute -bottom-12 left-2"></div>
          <div className="w-6 h-12 bg-blue-800 rounded absolute -bottom-12 right-2"></div>
        </div>
      </div>
    </div>
  )
}

export default function SmartTeacherApp() {
  const [currentPage, setCurrentPage] = useState("home")
  const [language, setLanguage] = useState<"en" | "ar">("en")
  const [user, setUser] = useState<any>(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { theme, setTheme } = useTheme()

  // Login/Register form states
  const [loginForm, setLoginForm] = useState({ email: "", password: "" })
  const [registerForm, setRegisterForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const t = translations[language]
  const isRTL = language === "ar"

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "ar" : "en")
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      if (loginForm.email && loginForm.password) {
        setUser({ name: "John Doe", email: loginForm.email })
        setCurrentPage("home")
      }
      setIsLoading(false)
    }, 1000)
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      if (registerForm.email && registerForm.password && registerForm.password === registerForm.confirmPassword) {
        setCurrentPage("login")
      }
      setIsLoading(false)
    }, 1000)
  }

  const handleLogout = () => {
    setUser(null)
    setCurrentPage("home")
  }

  // Navigation Component
  const Navigation = () => (
    <nav className="bg-white dark:bg-gray-900 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <button
              onClick={() => setCurrentPage("home")}
              className="text-2xl font-bold text-blue-600 dark:text-blue-400"
            >
              Smart Teacher
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className={`hidden md:flex items-center space-x-8 ${isRTL ? "space-x-reverse" : ""}`}>
            {["home", "about", "courses", "contact"].map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 text-sm font-medium transition-colors"
              >
                {t[page as keyof typeof t]}
              </button>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className={`hidden md:flex items-center space-x-4 ${isRTL ? "space-x-reverse" : ""}`}>
            <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>

            <Button variant="ghost" size="icon" onClick={toggleLanguage}>
              <Globe className="h-5 w-5" />
            </Button>

            {user ? (
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span className="text-sm">{user.name}</span>
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-1" />
                  {t.logout}
                </Button>
              </div>
            ) : (
              <div className={`flex space-x-2 ${isRTL ? "space-x-reverse" : ""}`}>
                <Button variant="ghost" onClick={() => setCurrentPage("login")}>
                  {t.login}
                </Button>
                <Button onClick={() => setCurrentPage("register")}>{t.register}</Button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 border-t dark:border-gray-700">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {["home", "about", "courses", "contact"].map((page) => (
              <button
                key={page}
                onClick={() => {
                  setCurrentPage(page)
                  setIsMenuOpen(false)
                }}
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 block px-3 py-2 text-base font-medium w-full text-left"
              >
                {t[page as keyof typeof t]}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  )

  // Home Page Component
  const HomePage = () => (
    <div className="min-h-screen" dir={isRTL ? "rtl" : "ltr"}>
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className={`text-center lg:text-left ${isRTL ? "lg:text-right" : ""}`}>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
                {t.title}
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">{t.subtitle}</p>
              <Button
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
                onClick={() => setCurrentPage("courses")}
              >
                {t.startLearning}
              </Button>
            </div>

            <div className={`flex justify-center lg:justify-end ${isRTL ? "lg:justify-start" : ""}`}>
              <SimpleRobot />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">{t.whyChoose}</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-lg bg-gray-50 dark:bg-gray-700">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🤖</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{t.aiPowered}</h3>
            </div>

            <div className="text-center p-6 rounded-lg bg-gray-50 dark:bg-gray-700">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📚</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{t.interactive}</h3>
            </div>

            <div className="text-center p-6 rounded-lg bg-gray-50 dark:bg-gray-700">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🌍</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{t.global}</h3>
            </div>
          </div>
        </div>
      </section>
    </div>
  )

  // Login Page Component
  const LoginPage = () => (
    <div className="min-h-screen flex items-center justify-center py-12 px-4" dir={isRTL ? "rtl" : "ltr"}>
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">{t.loginTitle}</CardTitle>
          <CardDescription>Enter your credentials to access your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">{t.email}</Label>
              <Input
                id="email"
                type="email"
                value={loginForm.email}
                onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                placeholder="Enter your email"
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">{t.password}</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                  placeholder="Enter your password"
                  required
                  disabled={isLoading}
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Loading..." : t.loginButton}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t.dontHaveAccount}{" "}
              <button
                onClick={() => setCurrentPage("register")}
                className="text-blue-600 hover:text-blue-500 font-medium"
              >
                {t.registerHere}
              </button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  // Register Page Component
  const RegisterPage = () => (
    <div className="min-h-screen flex items-center justify-center py-12 px-4" dir={isRTL ? "rtl" : "ltr"}>
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">{t.registerTitle}</CardTitle>
          <CardDescription>Create a new account to get started</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">{t.firstName}</Label>
                <Input
                  id="firstName"
                  type="text"
                  value={registerForm.firstName}
                  onChange={(e) => setRegisterForm({ ...registerForm, firstName: e.target.value })}
                  placeholder="First name"
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">{t.lastName}</Label>
                <Input
                  id="lastName"
                  type="text"
                  value={registerForm.lastName}
                  onChange={(e) => setRegisterForm({ ...registerForm, lastName: e.target.value })}
                  placeholder="Last name"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">{t.email}</Label>
              <Input
                id="email"
                type="email"
                value={registerForm.email}
                onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                placeholder="Enter your email"
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">{t.password}</Label>
              <Input
                id="password"
                type="password"
                value={registerForm.password}
                onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                placeholder="Enter your password"
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">{t.confirmPassword}</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={registerForm.confirmPassword}
                onChange={(e) => setRegisterForm({ ...registerForm, confirmPassword: e.target.value })}
                placeholder="Confirm your password"
                required
                disabled={isLoading}
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Creating Account..." : t.registerButton}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t.alreadyHaveAccount}{" "}
              <button onClick={() => setCurrentPage("login")} className="text-blue-600 hover:text-blue-500 font-medium">
                {t.loginHere}
              </button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  // Courses Page Component
  const CoursesPage = () => {
    if (!user) {
      return (
        <div className="min-h-screen flex items-center justify-center" dir={isRTL ? "rtl" : "ltr"}>
          <Card className="w-full max-w-md text-center">
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold mb-4">Access Restricted</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">Please login to access your courses</p>
              <Button onClick={() => setCurrentPage("login")}>{t.login}</Button>
            </CardContent>
          </Card>
        </div>
      )
    }

    return (
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8" dir={isRTL ? "rtl" : "ltr"}>
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">{t.courses}</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-2">Mathematics</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">Learn advanced mathematics concepts</p>
                <Button className="w-full">{t.startLearning}</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  // Simple About/Contact Pages
  const SimplePage = ({ title }: { title: string }) => (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8" dir={isRTL ? "rtl" : "ltr"}>
      <div className="max-w-7xl mx-auto text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">{title}</h1>
        <p className="text-xl text-gray-600 dark:text-gray-300">Coming soon...</p>
      </div>
    </div>
  )

  // Render current page
  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return <HomePage />
      case "login":
        return <LoginPage />
      case "register":
        return <RegisterPage />
      case "courses":
        return <CoursesPage />
      case "about":
        return <SimplePage title={t.about} />
      case "contact":
        return <SimplePage title={t.contact} />
      default:
        return <HomePage />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />
      {renderPage()}
    </div>
  )
}
