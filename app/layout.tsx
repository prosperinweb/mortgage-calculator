import "./globals.css";
import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import localFont from "next/font/local";

const plusJakartaSansItalic = localFont({
  src: "/fonts/PlusJakartaSans-Italic-VariableFont_wght.ttf",
  variable: "--plus-jakarta-sans-italic",
  display: "swap",
});

const plusJakartaSansRegular = localFont({
  src: "/fonts/PlusJakartaSans-VariableFont_wght.ttf",
  variable: "--plus-jakarta-sans-regular",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Mortgage Calculator",
  description: "Calculate your monthly mortgage payments",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${plusJakartaSansRegular.className} ${plusJakartaSansItalic.variable}`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TooltipProvider>{children}</TooltipProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
