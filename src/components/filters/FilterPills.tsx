"use client";

import { X } from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import { STATUS_LABELS } from "@/types";
import type { TravelRequestStatus } from "@/types";

export function FilterPills() {
  const { advancedFilters, setAdvancedFilters, activeFilterCount } = useApp();

  if (activeFilterCount === 0) return null;

  const removeStatus = (status: TravelRequestStatus) => {
    setAdvancedFilters({
      ...advancedFilters,
      statuses: advancedFilters.statuses.filter((s) => s !== status),
    });
  };

  const removeDestination = () => {
    setAdvancedFilters({ ...advancedFilters, destination: "" });
  };

  const removeApprover = () => {
    setAdvancedFilters({ ...advancedFilters, approver: "" });
  };

  const removeDateRange = () => {
    setAdvancedFilters({ ...advancedFilters, dateFrom: "", dateTo: "" });
  };

  return (
    <div
      className="mb-4 flex flex-wrap items-center gap-2"
      role="region"
      aria-label="Active filters"
    >
      <span className="text-sm font-medium text-gray-500">Filters:</span>

      {advancedFilters.statuses.map((status) => (
        <span
          key={status}
          className="inline-flex items-center gap-1 rounded-full border border-[#004C97]/20 bg-[#EEF2FF] px-3 py-1 text-sm font-medium text-[#004C97]"
        >
          {STATUS_LABELS[status]}
          <button
            type="button"
            onClick={() => removeStatus(status)}
            className="ml-0.5 rounded-full p-0.5 hover:bg-[#004C97]/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#004C97]"
            aria-label={`Remove ${STATUS_LABELS[status]} filter`}
          >
            <X className="h-3 w-3" aria-hidden="true" />
          </button>
        </span>
      ))}

      {advancedFilters.destination && (
        <span className="inline-flex items-center gap-1 rounded-full border border-[#004C97]/20 bg-[#EEF2FF] px-3 py-1 text-sm font-medium text-[#004C97]">
          {advancedFilters.destination}
          <button
            type="button"
            onClick={removeDestination}
            className="ml-0.5 rounded-full p-0.5 hover:bg-[#004C97]/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#004C97]"
            aria-label={`Remove ${advancedFilters.destination} destination filter`}
          >
            <X className="h-3 w-3" aria-hidden="true" />
          </button>
        </span>
      )}

      {advancedFilters.approver && (
        <span className="inline-flex items-center gap-1 rounded-full border border-[#004C97]/20 bg-[#EEF2FF] px-3 py-1 text-sm font-medium text-[#004C97]">
          {advancedFilters.approver}
          <button
            type="button"
            onClick={removeApprover}
            className="ml-0.5 rounded-full p-0.5 hover:bg-[#004C97]/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#004C97]"
            aria-label={`Remove ${advancedFilters.approver} approver filter`}
          >
            <X className="h-3 w-3" aria-hidden="true" />
          </button>
        </span>
      )}

      {(advancedFilters.dateFrom || advancedFilters.dateTo) && (
        <span className="inline-flex items-center gap-1 rounded-full border border-[#004C97]/20 bg-[#EEF2FF] px-3 py-1 text-sm font-medium text-[#004C97]">
          {advancedFilters.dateFrom || "Any"} – {advancedFilters.dateTo || "Any"}
          <button
            type="button"
            onClick={removeDateRange}
            className="ml-0.5 rounded-full p-0.5 hover:bg-[#004C97]/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#004C97]"
            aria-label="Remove date range filter"
          >
            <X className="h-3 w-3" aria-hidden="true" />
          </button>
        </span>
      )}
    </div>
  );
}
