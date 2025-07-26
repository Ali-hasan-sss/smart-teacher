import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";
import { LanguageProvider } from "../contexts/language-context";
import { AuthProvider } from "@/contexts/auth-context"; // عدّل المسار حسب مشروعك

const inter = Inter({ subsets: ["latin"] });

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
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <LanguageProvider>{children}</LanguageProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
