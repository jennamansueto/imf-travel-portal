"use client";

import { Mail } from "lucide-react";
import { useApp } from "@/contexts/AppContext";

export function EmailFab() {
  const { setEmailPanelOpen, unreadEmailCount, emailPanelOpen } = useApp();

  if (emailPanelOpen) return null;

  return (
    <button
      onClick={() => setEmailPanelOpen(true)}
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-[#002855] px-4 py-3 text-sm font-medium text-white shadow-lg transition-transform hover:scale-105 hover:bg-[#001a3a]"
      aria-label="Open email simulation panel"
    >
      <Mail className="h-4 w-4" />
      <span>📧 Emails</span>
      {unreadEmailCount > 0 && (
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold">
          {unreadEmailCount}
        </span>
      )}
    </button>
  );
}
