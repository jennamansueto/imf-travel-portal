"use client";

import { useMemo } from "react";
import { X } from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import type { TravelRequestStatus } from "@/types";
import { STATUS_LABELS, SORT_LABELS } from "@/types";

export function FilterPills() {
  const { advancedFilters, setAdvancedFilters } = useApp();

  const pills = useMemo(() => {
    const items: { key: string; label: string }[] = [];

    for (const status of advancedFilters.statuses) {
      items.push({ key: `status:${status}`, label: STATUS_LABELS[status] });
    }
    if (advancedFilters.destination) {
      items.push({
        key: "destination",
        label: advancedFilters.destination,
      });
    }
    if (advancedFilters.dateFrom || advancedFilters.dateTo) {
      const from = advancedFilters.dateFrom || "...";
      const to = advancedFilters.dateTo || "...";
      items.push({ key: "dates", label: `${from} – ${to}` });
    }
    if (advancedFilters.approver) {
      items.push({ key: "approver", label: advancedFilters.approver });
    }
    if (advancedFilters.sortBy !== "updated_newest") {
      items.push({
        key: "sort",
        label: SORT_LABELS[advancedFilters.sortBy],
      });
    }
    return items;
  }, [advancedFilters]);

  const handleRemove = (key: string) => {
    if (key.startsWith("status:")) {
      const status = key.replace("status:", "") as TravelRequestStatus;
      setAdvancedFilters({
        ...advancedFilters,
        statuses: advancedFilters.statuses.filter((s) => s !== status),
      });
    } else if (key === "destination") {
      setAdvancedFilters({ ...advancedFilters, destination: "" });
    } else if (key === "dates") {
      setAdvancedFilters({ ...advancedFilters, dateFrom: "", dateTo: "" });
    } else if (key === "approver") {
      setAdvancedFilters({ ...advancedFilters, approver: "" });
    } else if (key === "sort") {
      setAdvancedFilters({ ...advancedFilters, sortBy: "updated_newest" });
    }
  };

  if (pills.length === 0) return null;

  return (
    <section
      className="mb-4 flex flex-wrap items-center gap-2"
      aria-label="Active filters"
    >
      {pills.map((pill) => (
        <span
          key={pill.key}
          className="inline-flex items-center gap-1.5 rounded-full border border-[#004C97]/20 bg-[#EEF2FF] px-3 py-1 text-sm font-medium text-[#004C97]"
        >
          {pill.label}
          <button
            type="button"
            onClick={() => handleRemove(pill.key)}
            className="ml-0.5 rounded-full p-0.5 text-[#004C97]/60 hover:text-[#004C97] hover:bg-[#004C97]/10 focus:outline-none focus:ring-2 focus:ring-[#004C97] transition-colors"
            aria-label={`Remove ${pill.label} filter`}
          >
            <X className="h-3 w-3" aria-hidden="true" />
          </button>
        </span>
      ))}
      <span className="text-sm text-[#707372]" aria-live="polite">
        {pills.length} {pills.length === 1 ? "filter" : "filters"} active
      </span>
    </section>
  );
}
