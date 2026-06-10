"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Shield,
  Settings,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  Users,
  BarChart3,
  History,
} from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import { cn } from "@/lib/utils";

const roleNavItems = {
  requestor: [
    { href: "/dashboard", label: "My Requests", icon: LayoutDashboard },
    { href: "/requests/new", label: "New Request", icon: FileText },
  ],
  approver: [
    { href: "/dashboard", label: "Review Queue", icon: ClipboardCheck },
  ],
  administrator: [
    { href: "/dashboard", label: "Overview", icon: BarChart3 },
    { href: "/admin/pipeline", label: "Pipeline", icon: Settings },
    { href: "/admin/audit", label: "Audit Trail", icon: History },
    { href: "/admin/users", label: "Users", icon: Users },
  ],
};

export function Sidebar() {
  const { role, sidebarCollapsed, setSidebarCollapsed } = useApp();
  const pathname = usePathname();
  const navItems = roleNavItems[role];

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 flex h-full flex-col border-r border-[#001E60] bg-[#004C97] text-white transition-all duration-200",
        sidebarCollapsed ? "w-16" : "w-[260px]"
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 border-b border-[#001E60] px-4">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-white/10 font-bold text-white">
          IMF
        </div>
        {!sidebarCollapsed && (
          <div className="flex flex-col">
            <span className="text-sm font-semibold tracking-wide">
              Travel Portal
            </span>
            <span className="text-[10px] uppercase tracking-widest text-blue-300">
              Internal System
            </span>
          </div>
        )}
      </div>

      {/* Dev banner */}
      {!sidebarCollapsed && (
        <div className="mx-3 mt-3 rounded-md bg-amber-500/20 px-3 py-1.5 text-center text-[10px] font-semibold uppercase tracking-wider text-amber-300">
          Development Environment
        </div>
      )}

      {/* Navigation */}
      <nav className="mt-4 flex-1 space-y-1 px-2">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-white/15 text-white"
                  : "text-blue-200 hover:bg-white/10 hover:text-white"
              )}
              title={sidebarCollapsed ? item.label : undefined}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {!sidebarCollapsed && <span>{item.label}</span>}
            </Link>
          );
        })}

        {/* Common items */}
        <div className="my-4 border-t border-white/10" />
        <Link
          href="/clearance"
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
            pathname.startsWith("/clearance")
              ? "bg-white/15 text-white"
              : "text-blue-200 hover:bg-white/10 hover:text-white"
          )}
          title={sidebarCollapsed ? "UN Clearance" : undefined}
        >
          <Shield className="h-5 w-5 shrink-0" />
          {!sidebarCollapsed && <span>UN Clearance</span>}
        </Link>
      </nav>

      {/* Collapse toggle */}
      <button
        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
        className="flex h-12 items-center justify-center border-t border-[#001E60] text-blue-300 hover:bg-white/10 hover:text-white"
        aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {sidebarCollapsed ? (
          <ChevronRight className="h-4 w-4" />
        ) : (
          <ChevronLeft className="h-4 w-4" />
        )}
      </button>
    </aside>
  );
}
