import type React from "react";
import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";
import { LanguageProvider } from "../contexts/language-context";
import { Navbar } from "@/components/navbar";
import { ReduxProvider } from "@/store/ReduxProvider";
import Footer from "@/components/footer";

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
    <html lang="en">
      <body className={cairo.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <ReduxProvider>
            <LanguageProvider>
              <Navbar />
              <div className="">{children}</div>
              <Footer />
            </LanguageProvider>
          </ReduxProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
