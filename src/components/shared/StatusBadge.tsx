"use client";

import {
  FileEdit,
  Clock,
  RotateCcw,
  CheckCircle2,
  Send,
  Loader2,
  ShieldCheck,
  ShieldX,
  AlertTriangle,
} from "lucide-react";
import type { TravelRequestStatus } from "@/types";
import { STATUS_LABELS, STATUS_COLORS } from "@/types";
import { cn } from "@/lib/utils";

const statusIcons: Record<TravelRequestStatus, React.ElementType> = {
  draft: FileEdit,
  pending_approval: Clock,
  returned_by_approver: RotateCcw,
  approved: CheckCircle2,
  sent_to_un: Send,
  un_processing: Loader2,
  un_approved: ShieldCheck,
  un_rejected: ShieldX,
  returned_by_un: AlertTriangle,
};

export function StatusBadge({
  status,
  size = "default",
}: {
  status: TravelRequestStatus;
  size?: "default" | "lg";
}) {
  const Icon = statusIcons[status];
  const colors = STATUS_COLORS[status];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border font-medium",
        colors.bg,
        colors.text,
        colors.border,
        size === "lg" ? "px-3 py-1.5 text-sm" : "px-2.5 py-0.5 text-xs"
      )}
    >
      <Icon
        className={cn(
          "shrink-0",
          size === "lg" ? "h-4 w-4" : "h-3.5 w-3.5",
          status === "un_processing" && "animate-spin"
        )}
      />
      {STATUS_LABELS[status]}
    </span>
  );
}
