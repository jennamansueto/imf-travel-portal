"use client";

import { Bell, Search, ChevronDown, Mail } from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import type { UserRole } from "@/types";
import { cn } from "@/lib/utils";

const roleLabels: Record<UserRole, { label: string; color: string }> = {
  requestor: { label: "Requestor", color: "bg-blue-100 text-blue-800" },
  approver: { label: "Approver", color: "bg-purple-100 text-purple-800" },
  administrator: {
    label: "Administrator",
    color: "bg-emerald-100 text-emerald-800",
  },
};

export function TopBar() {
  const {
    role,
    setRole,
    sidebarCollapsed,
    unreadEmailCount,
    setEmailPanelOpen,
  } = useApp();

  return (
    <header
      className={cn(
        "fixed top-0 z-30 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6 transition-all duration-200",
        sidebarCollapsed ? "left-16" : "left-[260px]",
        "right-0"
      )}
    >
      {/* Left: Breadcrumbs / Search */}
      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search requests..."
            className="w-64 pl-9 text-sm"
            aria-label="Search requests"
          />
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3">
        {/* Fabric indicator */}
        <div className="hidden items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600 md:flex">
          <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
          Source: Fabric Data Table
        </div>

        {/* Email panel toggle */}
        <button
          onClick={() => setEmailPanelOpen(true)}
          className="relative rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
          aria-label="Open email panel"
        >
          <Mail className="h-5 w-5" />
          {unreadEmailCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#DA291C] text-[10px] font-bold text-white">
              {unreadEmailCount}
            </span>
          )}
        </button>

        {/* Notifications */}
        <button
          className="relative rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#DA291C] text-[10px] font-bold text-white">
            3
          </span>
        </button>

        {/* Role Switcher */}
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-1.5 text-sm hover:bg-gray-50">
              <Badge
                variant="secondary"
                className={cn(
                  "text-xs font-medium",
                  roleLabels[role].color
                )}
              >
                {roleLabels[role].label}
              </Badge>
              <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {(Object.keys(roleLabels) as UserRole[]).map((r) => (
              <DropdownMenuItem key={r} onClick={() => setRole(r)}>
                <Badge
                  variant="secondary"
                  className={cn(
                    "mr-2 text-xs font-medium",
                    roleLabels[r].color
                  )}
                >
                  {roleLabels[r].label}
                </Badge>
                {r === role && (
                  <span className="ml-auto text-xs text-gray-400">
                    Active
                  </span>
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Avatar */}
        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-[#004C97] text-xs text-white">
            EV
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
