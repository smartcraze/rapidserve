import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Outfit, Fira_Code } from "next/font/google";
import "./globals.css";

const sans = Plus_Jakarta_Sans({
  variable: "--font-sans-custom",
  subsets: ["latin"],
});

const display = Outfit({
  variable: "--font-display-custom",
  subsets: ["latin"],
});

const mono = Fira_Code({
  variable: "--font-mono-custom",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Rapidserve",
  description:
    "A platform to run your Docker projects from Git repositories seamlessly.",
};

import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${sans.variable} ${display.variable} ${mono.variable} antialiased font-sans`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster closeButton position="bottom-right" richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
