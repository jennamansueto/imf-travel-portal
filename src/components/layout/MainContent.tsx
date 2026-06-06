"use client";

import { useApp } from "@/contexts/AppContext";
import { cn } from "@/lib/utils";

export function MainContent({ children }: { children: React.ReactNode }) {
  const { sidebarCollapsed } = useApp();
  return (
    <main
      className={cn(
        "min-h-screen pt-16 transition-all duration-200",
        sidebarCollapsed ? "pl-16" : "pl-[260px]"
      )}
    >
      <div className="p-6">{children}</div>
    </main>
  );
}
