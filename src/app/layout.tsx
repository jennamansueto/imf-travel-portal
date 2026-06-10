import type { Metadata } from "next";
import "./globals.css";
import { AppProvider } from "@/contexts/AppContext";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";
import { EmailPanel } from "@/components/email/EmailPanel";
import { EmailFab } from "@/components/email/EmailFab";
import { MainContent } from "@/components/layout/MainContent";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";

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
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full bg-[#F8FAFC] font-sans">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-[#004C97] focus:px-4 focus:py-2 focus:text-white focus:outline-none"
        >
          Skip to main content
        </a>
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
