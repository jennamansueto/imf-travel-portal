import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/contexts/AppContext";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";
import { EmailPanel } from "@/components/email/EmailPanel";
import { EmailFab } from "@/components/email/EmailFab";
import { MainContent } from "@/components/layout/MainContent";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "IMF Travel Portal",
  description:
    "Internal travel request management system — International Monetary Fund",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full bg-[#F8FAFC] font-sans">
        <AppProvider>
          <TooltipProvider>
            <Sidebar />
            <TopBar />
            <MainContent>{children}</MainContent>
            <EmailPanel />
            <EmailFab />
            <Toaster position="top-right" richColors />
          </TooltipProvider>
        </AppProvider>
      </body>
    </html>
  );
}
