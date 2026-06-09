"use client";

import { X } from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import type { AdvancedFilters, TravelRequestStatus } from "@/types";
import { STATUS_LABELS, DEFAULT_FILTERS } from "@/types";
import { format } from "date-fns";

function countActiveFilters(filters: AdvancedFilters): number {
  let count = 0;
  if (filters.statuses.length > 0) count += filters.statuses.length;
  if (filters.destination) count++;
  if (filters.dateFrom || filters.dateTo) count++;
  if (filters.approver) count++;
  return count;
}

export function ActiveFilterPills() {
  const { filters, setFilters } = useApp();
  const activeCount = countActiveFilters(filters);

  if (activeCount === 0) return null;

  const removeStatus = (status: TravelRequestStatus) => {
    setFilters({
      ...filters,
      statuses: filters.statuses.filter((s) => s !== status),
    });
  };

  const removeDestination = () => {
    setFilters({ ...filters, destination: null });
  };

  const removeDateRange = () => {
    setFilters({ ...filters, dateFrom: null, dateTo: null });
  };

  const removeApprover = () => {
    setFilters({ ...filters, approver: null });
  };

  const clearAll = () => {
    setFilters({ ...DEFAULT_FILTERS });
  };

  const pills: { label: string; onRemove: () => void }[] = [];

  for (const status of filters.statuses) {
    pills.push({
      label: STATUS_LABELS[status],
      onRemove: () => removeStatus(status),
    });
  }

  if (filters.destination) {
    pills.push({
      label: filters.destination,
      onRemove: removeDestination,
    });
  }

  if (filters.dateFrom || filters.dateTo) {
    const from = filters.dateFrom
      ? format(new Date(filters.dateFrom), "MMM d")
      : "...";
    const to = filters.dateTo
      ? format(new Date(filters.dateTo), "MMM d")
      : "...";
    pills.push({
      label: `${from} – ${to}`,
      onRemove: removeDateRange,
    });
  }

  if (filters.approver) {
    pills.push({
      label: filters.approver,
      onRemove: removeApprover,
    });
  }

  return (
    <div className="mb-4 flex flex-wrap items-center gap-2">
      {pills.map((pill) => (
        <span
          key={pill.label}
          className="inline-flex items-center gap-1 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-sm text-blue-700"
        >
          {pill.label}
          <button
            onClick={pill.onRemove}
            className="ml-0.5 rounded-full p-0.5 hover:bg-blue-100"
            aria-label={`Remove ${pill.label} filter`}
          >
            <X className="h-3 w-3" />
          </button>
        </span>
      ))}
      <span className="text-sm text-gray-500">
        {activeCount} {activeCount === 1 ? "filter" : "filters"} active
      </span>
      <button
        onClick={clearAll}
        className="text-sm font-medium text-blue-600 hover:text-blue-800"
      >
        Clear all
      </button>
    </div>
  );
}

export { countActiveFilters };
