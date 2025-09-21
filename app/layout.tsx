import type React from "react";
import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";
import { LanguageProvider } from "../contexts/language-context";
import { Navbar } from "@/components/navbar";
import { ReduxProvider } from "@/store/ReduxProvider";
import Footer from "@/components/footer";
import { Toaster } from "@/components/ui/toaster";
import FirebaseNotifications from "@/components/FirebaseNotifications";
import ClientOnly from "./wrapper";
import GoogleTagManager, {
  GoogleTagManagerNoScript,
} from "@/components/GoogleTagManager";

const cairo = Cairo({ subsets: ["arabic"] });

export const metadata: Metadata = {
  title: "Smart Teacher - AI Learning Platform",
  description: "Learn smarter with AI-powered education",
  generator: "v0.dev",
  icons: {
    icon: [
      { url: "/images/logo.png", sizes: "32x32", type: "image/png" },
      { url: "/images/smallLogo.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [{ url: "/images/logo.png", sizes: "180x180", type: "image/png" }],
    shortcut: "/images/logo.png",
  },
  openGraph: {
    title: "Smart Teacher - AI Learning Platform",
    description: "Learn smarter with AI-powered education",
    url: "https://smartteacher.com",
    siteName: "Smart Teacher",
    images: [
      {
        url: "/images/logo.png",
        width: 1200,
        height: 630,
        alt: "Smart Teacher Logo",
      },
    ],
    locale: "ar",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Smart Teacher - AI Learning Platform",
    description: "Learn smarter with AI-powered education",
    images: ["/images/logo.png"],
    creator: "@smartteacher",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar">
      <head>
        <GoogleTagManager />
      </head>
      <body className={`${cairo.className} bg-white dark:bg-secondary `}>
        <GoogleTagManagerNoScript />
        <ClientOnly>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            <ReduxProvider>
              <LanguageProvider>
                <Navbar />
                <Toaster />
                <FirebaseNotifications />
                <div className="min-h-[80vh] overflow-hidden">{children}</div>
                <Footer />
              </LanguageProvider>
            </ReduxProvider>
          </ThemeProvider>
        </ClientOnly>
      </body>
    </html>
  );
}
