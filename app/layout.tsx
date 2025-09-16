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
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar">
      <head>
        <link rel="icon" href="/images/logo.png" type="image/x-icon" />
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
