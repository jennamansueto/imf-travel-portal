"use client";

import { useState, useMemo, useCallback } from "react";
import { Filter, X, ChevronDown } from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { TravelRequestStatus, AdvancedFilters, SortOption } from "@/types";
import { STATUS_LABELS, SORT_LABELS, DEFAULT_FILTERS } from "@/types";
import { cn } from "@/lib/utils";

const ALL_STATUSES: TravelRequestStatus[] = [
  "draft",
  "pending_approval",
  "returned_by_approver",
  "approved",
  "sent_to_un",
  "un_processing",
  "un_approved",
  "un_rejected",
  "returned_by_un",
];

export function AdvancedFiltersPanel() {
  const {
    requests,
    advancedFilters,
    setAdvancedFilters,
    activeFilterCount,
  } = useApp();

  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<AdvancedFilters>(advancedFilters);

  const destinations = useMemo(() => {
    const dests = new Set<string>();
    for (const r of requests) {
      if (r.primaryDestination) dests.add(r.primaryDestination);
    }
    return Array.from(dests).sort();
  }, [requests]);

  const approvers = useMemo(() => {
    const apps = new Set<string>();
    for (const r of requests) {
      if (r.approver) apps.add(r.approver);
    }
    return Array.from(apps).sort();
  }, [requests]);

  const draftFilterCount = useMemo(() => {
    let count = 0;
    if (draft.statuses.length > 0) count += draft.statuses.length;
    if (draft.destination) count += 1;
    if (draft.approver) count += 1;
    if (draft.dateFrom || draft.dateTo) count += 1;
    return count;
  }, [draft]);

  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      if (nextOpen) {
        setDraft(advancedFilters);
      }
      setOpen(nextOpen);
    },
    [advancedFilters]
  );

  const toggleStatus = useCallback((status: TravelRequestStatus) => {
    setDraft((prev) => ({
      ...prev,
      statuses: prev.statuses.includes(status)
        ? prev.statuses.filter((s) => s !== status)
        : [...prev.statuses, status],
    }));
  }, []);

  const handleApply = useCallback(() => {
    setAdvancedFilters(draft);
    setOpen(false);
  }, [draft, setAdvancedFilters]);

  const handleCancel = useCallback(() => {
    setOpen(false);
  }, []);

  const handleClearAll = useCallback(() => {
    setDraft(DEFAULT_FILTERS);
  }, []);

  const isActive = activeFilterCount > 0;

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger
        className={cn(
          "inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#004C97] focus-visible:ring-offset-2",
          isActive
            ? "border-[#004C97] bg-[#EEF2FF] text-[#004C97]"
            : "border-gray-300 bg-white text-gray-600 hover:bg-gray-50"
        )}
        aria-label={`Filters${isActive ? `, ${activeFilterCount} active` : ""}`}
      >
        <Filter className="h-4 w-4" aria-hidden="true" />
        Filters
      </PopoverTrigger>

      <PopoverContent
        align="start"
        sideOffset={8}
        className="w-[490px] rounded-xl border border-gray-200 bg-white p-0 shadow-lg"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 pt-5 pb-4">
          <h2
            className="text-lg font-semibold text-[#001E60]"
            style={{ fontFamily: 'Arial, "Helvetica Neue", Helvetica, sans-serif' }}
          >
            Filters
          </h2>
          <button
            type="button"
            onClick={handleClearAll}
            className="text-sm font-medium text-[#004C97] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#004C97] focus-visible:rounded"
          >
            Clear all
          </button>
        </div>

        <div className="space-y-5 px-6 py-4">
          {/* Status checkboxes */}
          <fieldset>
            <legend
              className="mb-3 text-sm font-semibold text-[#001E60]"
              style={{ fontFamily: 'Arial, "Helvetica Neue", Helvetica, sans-serif' }}
            >
              Status
            </legend>
            <div className="grid grid-cols-3 gap-x-4 gap-y-2.5">
              {ALL_STATUSES.map((status) => {
                const id = `filter-status-${status}`;
                return (
                  <div key={status} className="flex items-center gap-2">
                    <Checkbox
                      id={id}
                      checked={draft.statuses.includes(status)}
                      onCheckedChange={() => toggleStatus(status)}
                      aria-describedby={undefined}
                    />
                    <Label
                      htmlFor={id}
                      className="cursor-pointer text-sm font-normal text-gray-700"
                    >
                      {STATUS_LABELS[status]}
                    </Label>
                  </div>
                );
              })}
            </div>
          </fieldset>

          {/* Destination + Travel Dates row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label
                htmlFor="filter-destination"
                className="mb-1.5 text-sm font-semibold text-[#001E60]"
                style={{ fontFamily: 'Arial, "Helvetica Neue", Helvetica, sans-serif' }}
              >
                Destination
              </Label>
              <div className="relative">
                <select
                  id="filter-destination"
                  value={draft.destination}
                  onChange={(e) =>
                    setDraft((prev) => ({
                      ...prev,
                      destination: e.target.value,
                    }))
                  }
                  className="h-9 w-full appearance-none rounded-lg border border-gray-300 bg-white py-2 pr-8 pl-3 text-sm text-gray-700 focus:border-[#004C97] focus:outline-none focus:ring-2 focus:ring-[#004C97]/30"
                >
                  <option value="">Select country or city...</option>
                  {destinations.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
                  aria-hidden="true"
                />
              </div>
            </div>

            <div>
              <Label
                htmlFor="filter-date-from"
                className="mb-1.5 text-sm font-semibold text-[#001E60]"
                style={{ fontFamily: 'Arial, "Helvetica Neue", Helvetica, sans-serif' }}
              >
                Travel Dates
              </Label>
              <div className="flex items-center gap-1.5">
                <input
                  type="date"
                  id="filter-date-from"
                  value={draft.dateFrom}
                  onChange={(e) =>
                    setDraft((prev) => ({ ...prev, dateFrom: e.target.value }))
                  }
                  className="h-9 w-full rounded-lg border border-gray-300 bg-white px-2.5 text-sm text-gray-700 focus:border-[#004C97] focus:outline-none focus:ring-2 focus:ring-[#004C97]/30"
                  aria-label="Travel date from"
                />
                <span className="text-xs text-gray-400" aria-hidden="true">
                  –
                </span>
                <input
                  type="date"
                  id="filter-date-to"
                  value={draft.dateTo}
                  onChange={(e) =>
                    setDraft((prev) => ({ ...prev, dateTo: e.target.value }))
                  }
                  className="h-9 w-full rounded-lg border border-gray-300 bg-white px-2.5 text-sm text-gray-700 focus:border-[#004C97] focus:outline-none focus:ring-2 focus:ring-[#004C97]/30"
                  aria-label="Travel date to"
                />
              </div>
            </div>
          </div>

          {/* Approver + Sort By row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label
                htmlFor="filter-approver"
                className="mb-1.5 text-sm font-semibold text-[#001E60]"
                style={{ fontFamily: 'Arial, "Helvetica Neue", Helvetica, sans-serif' }}
              >
                Approver
              </Label>
              <div className="relative">
                <select
                  id="filter-approver"
                  value={draft.approver}
                  onChange={(e) =>
                    setDraft((prev) => ({ ...prev, approver: e.target.value }))
                  }
                  className={cn(
                    "h-9 w-full appearance-none rounded-lg border border-gray-300 bg-white py-2 pl-3 text-sm text-gray-700 focus:border-[#004C97] focus:outline-none focus:ring-2 focus:ring-[#004C97]/30",
                    draft.approver ? "pr-8" : "pr-8"
                  )}
                >
                  <option value="">Select approver...</option>
                  {approvers.map((a) => (
                    <option key={a} value={a}>
                      {a}
                    </option>
                  ))}
                </select>
                {draft.approver ? (
                  <button
                    type="button"
                    onClick={() =>
                      setDraft((prev) => ({ ...prev, approver: "" }))
                    }
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-gray-400 hover:text-gray-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#004C97]"
                    aria-label="Clear approver filter"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                ) : (
                  <ChevronDown
                    className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
                    aria-hidden="true"
                  />
                )}
              </div>
            </div>

            <div>
              <Label
                htmlFor="filter-sort"
                className="mb-1.5 text-sm font-semibold text-[#001E60]"
                style={{ fontFamily: 'Arial, "Helvetica Neue", Helvetica, sans-serif' }}
              >
                Sort By
              </Label>
              <div className="relative">
                <select
                  id="filter-sort"
                  value={draft.sortBy}
                  onChange={(e) =>
                    setDraft((prev) => ({
                      ...prev,
                      sortBy: e.target.value as SortOption,
                    }))
                  }
                  className="h-9 w-full appearance-none rounded-lg border border-gray-300 bg-white py-2 pr-8 pl-3 text-sm text-gray-700 focus:border-[#004C97] focus:outline-none focus:ring-2 focus:ring-[#004C97]/30"
                >
                  {(Object.keys(SORT_LABELS) as SortOption[]).map((key) => (
                    <option key={key} value={key}>
                      {SORT_LABELS[key]}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
                  aria-hidden="true"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-gray-100 px-6 py-4">
          <Button
            variant="outline"
            onClick={handleCancel}
            className="rounded-lg border-gray-300 px-5"
          >
            Cancel
          </Button>
          <Button
            onClick={handleApply}
            className="rounded-lg bg-[#004C97] px-5 text-white hover:bg-[#003d7a] focus-visible:ring-2 focus-visible:ring-[#004C97] focus-visible:ring-offset-2"
          >
            Apply ({draftFilterCount})
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
