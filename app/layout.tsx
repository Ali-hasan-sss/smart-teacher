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
import StructuredData from "@/components/StructuredData";

const cairo = Cairo({ subsets: ["arabic"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://smartteacherom.com"),
  title: "Smart Teacher - AI Learning Platform",
  description: "Learn smarter with AI-powered education",
  generator: "v0.dev",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/images/logo.png", sizes: "32x32", type: "image/png" },
      { url: "/images/smallLogo.png", sizes: "16x16", type: "image/png" },
      { url: "/images/logo.png", sizes: "48x48", type: "image/png" },
      { url: "/images/logo.png", sizes: "96x96", type: "image/png" },
      { url: "/images/logo.png", sizes: "144x144", type: "image/png" },
    ],
    apple: [
      { url: "/images/logo.png", sizes: "180x180", type: "image/png" },
      { url: "/images/logo.png", sizes: "152x152", type: "image/png" },
      { url: "/images/logo.png", sizes: "120x120", type: "image/png" },
      { url: "/images/logo.png", sizes: "76x76", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
  },
  openGraph: {
    title: "Smart Teacher - AI Learning Platform",
    description: "Learn smarter with AI-powered education",
    url: "/",
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
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link
          rel="icon"
          href="/favicon-16x16.png"
          sizes="16x16"
          type="image/png"
        />
        <link
          rel="icon"
          href="/favicon-32x32.png"
          sizes="32x32"
          type="image/png"
        />
        <link rel="icon" href="/images/logo.png" type="image/png" />
        <link
          rel="apple-touch-icon"
          href="/apple-touch-icon.png"
          sizes="180x180"
        />
        <link rel="apple-touch-icon" href="/images/logo.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#3B82F6" />
        <meta name="msapplication-TileColor" content="#3B82F6" />
        <meta name="msapplication-TileImage" content="/images/logo.png" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <meta name="application-name" content="Smart Teacher" />
        <meta name="apple-mobile-web-app-title" content="Smart Teacher" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta
          name="msapplication-tooltip"
          content="Smart Teacher - AI Learning Platform"
        />
        <meta name="msapplication-starturl" content="/" />
        <StructuredData />
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
