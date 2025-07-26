export const translations = {
  en: {
    navigation: {
      home: "Home",
      about: "About",
      courses: "Courses",
      contact: "Contact",
      login: "Login",
      register: "Register",
      logout: "Logout",
    },
    homePage: {
      title: "Welcome to Smart Teacher",
      subtitle: "Learn smarter, not harder with AI-powered education",
      startLearning: "Start Learning",
      whyChoose: "Why Choose Smart Teacher?",
      description: "Discover a new way of learning with our intelligent teaching platform",
      aiPowered: "AI-Powered Learning",
      aiDescription: "Personalized learning experience powered by artificial intelligence",
      interactive: "Interactive Courses",
      interactiveDescription: "Engaging and interactive courses designed for effective learning",
      global: "Global Access",
      globalDescription: "Learn from anywhere in the world with multilingual support",
    },
    auth: {
      loginTitle: "Login to Your Account",
      registerTitle: "Create New Account",
      email: "Email",
      password: "Password",
      confirmPassword: "Confirm Password",
      firstName: "First Name",
      lastName: "Last Name",
      phoneNumber: "Phone Number",
      birthdate: "Birth Date",
      loginButton: "Login",
      registerButton: "Register",
      dontHaveAccount: "Don't have an account?",
      alreadyHaveAccount: "Already have an account?",
      loginHere: "Login here",
      registerHere: "Register here",
      fillAllFields: "Please fill in all fields",
      passwordsDontMatch: "Passwords do not match",
      invalidEmail: "Please enter a valid email address",
    },
    courses: {
      title: "Your Courses",
      mathematics: "Mathematics",
      mathDescription: "Learn advanced mathematics concepts",
      startLearning: "Start Learning",
    },
  },
  ar: {
    navigation: {
      home: "الرئيسية",
      about: "حول",
      courses: "الدورات",
      contact: "اتصل بنا",
      login: "تسجيل الدخول",
      register: "إنشاء حساب",
      logout: "تسجيل الخروج",
    },
    homePage: {
      title: "مرحباً بك في المعلم الذكي",
      subtitle: "تعلم بذكاء، وليس بجهد أكبر مع التعليم المدعوم بالذكاء الاصطناعي",
      startLearning: "ابدأ التعلم",
      whyChoose: "لماذا تختار المعلم الذكي؟",
      description: "اكتشف طريقة جديدة للتعلم مع منصة التدريس الذكية",
      aiPowered: "التعلم بالذكاء الاصطناعي",
      aiDescription: "تجربة تعلم شخصية مدعومة بالذكاء الاصطناعي",
      interactive: "دورات تفاعلية",
      interactiveDescription: "دورات جذابة وتفاعلية مصممة للتعلم الفعال",
      global: "وصول عالمي",
      globalDescription: "تعلم من أي مكان في العالم مع الدعم متعدد اللغات",
    },
    auth: {
      loginTitle: "تسجيل الدخول إلى حسابك",
      registerTitle: "إنشاء حساب جديد",
      email: "البريد الإلكتروني",
      password: "كلمة المرور",
      confirmPassword: "تأكيد كلمة المرور",
      firstName: "الاسم الأول",
      lastName: "اسم العائلة",
      phoneNumber: "رقم الهاتف",
      birthdate: "تاريخ الميلاد",
      loginButton: "تسجيل الدخول",
      registerButton: "إنشاء حساب",
      dontHaveAccount: "ليس لديك حساب؟",
      alreadyHaveAccount: "هل لديك حساب بالفعل؟",
      loginHere: "سجل الدخول هنا",
      registerHere: "أنشئ حساباً هنا",
      fillAllFields: "يرجى ملء جميع الحقول",
      passwordsDontMatch: "كلمات المرور غير متطابقة",
      invalidEmail: "يرجى إدخال عنوان بريد إلكتروني صحيح",
    },
    courses: {
      title: "دوراتك",
      mathematics: "الرياضيات",
      mathDescription: "تعلم مفاهيم الرياضيات المتقدمة",
      startLearning: "ابدأ التعلم",
    },
  },
}

export type Language = "en" | "ar"

export function getTranslation(lang: Language, key: string): string {
  const keys = key.split(".")
  let value: any = translations[lang]

  for (const k of keys) {
    value = value?.[k]
  }

  return value || key
}
