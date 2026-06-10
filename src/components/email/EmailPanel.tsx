"use client";

import { Mail, ExternalLink } from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import Link from "next/link";

export function EmailPanel() {
  const { emails, emailPanelOpen, setEmailPanelOpen, markEmailRead } =
    useApp();

  return (
    <Sheet open={emailPanelOpen} onOpenChange={setEmailPanelOpen}>
      <SheetContent className="w-[440px] sm:max-w-[440px]">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Email Simulation Panel
          </SheetTitle>
          <p className="text-xs text-muted-foreground">
            Shows emails the system would send. Deep links are clickable.
          </p>
        </SheetHeader>
        <ScrollArea className="mt-4 h-[calc(100vh-120px)]">
          <div className="space-y-3 pr-4">
            {emails.map((email) => (
              <div
                key={email.id}
                className={`rounded-lg border p-4 transition-colors ${
                  email.read
                    ? "border-gray-200 bg-white"
                    : "border-blue-200 bg-blue-50/50"
                }`}
              >
                <div className="mb-2 flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    {!email.read && (
                      <div className="h-2 w-2 rounded-full bg-blue-500" />
                    )}
                    <span className="text-xs text-gray-500">
                      {format(new Date(email.timestamp), "MMM d, h:mm a")}
                    </span>
                  </div>
                  {!email.read && (
                    <button
                      onClick={() => markEmailRead(email.id)}
                      className="text-xs text-blue-600 hover:underline"
                    >
                      Mark read
                    </button>
                  )}
                </div>
                <p className="mb-1 text-xs text-gray-500">
                  To: {email.to}
                </p>
                <p className="mb-2 text-sm font-semibold text-gray-900">
                  {email.subject}
                </p>
                <p className="mb-3 text-xs text-gray-600 leading-relaxed">
                  {email.body}
                </p>
                <Link
                  href={email.deepLink}
                  onClick={() => {
                    markEmailRead(email.id);
                    setEmailPanelOpen(false);
                  }}
                  className="inline-flex items-center gap-1 text-xs font-medium text-[#004C97] hover:underline"
                >
                  <ExternalLink className="h-3 w-3" />
                  Open in portal
                </Link>
              </div>
            ))}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
