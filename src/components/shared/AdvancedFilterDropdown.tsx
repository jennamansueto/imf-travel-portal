"use client";

import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { X, ChevronDown } from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import type {
  TravelRequestStatus,
  AdvancedFilters,
  SortOption,
} from "@/types";
import {
  STATUS_LABELS,
  SORT_LABELS,
  EMPTY_FILTERS,
} from "@/types";

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

const SORT_OPTIONS: SortOption[] = [
  "updated_newest",
  "updated_oldest",
  "travel_soonest",
  "travel_latest",
  "req_asc",
  "req_desc",
];

export function AdvancedFilterDropdown() {
  const { advancedFilters, setAdvancedFilters, filtersOpen, setFiltersOpen, requests } =
    useApp();

  const [draft, setDraft] = useState<AdvancedFilters>(advancedFilters);
  const panelRef = useRef<HTMLDialogElement>(null);
  const firstFocusableRef = useRef<HTMLButtonElement>(null);

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setFiltersOpen(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [filtersOpen, setFiltersOpen]);

  // Focus trap
  useEffect(() => {
    if (!panelRef.current) return;
    const focusable = panelRef.current.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (focusable.length > 0) {
      focusable[0].focus();
    }
    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== "Tab" || !panelRef.current) return;
      const items = panelRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", handleTab);
    return () => document.removeEventListener("keydown", handleTab);
  }, [filtersOpen]);

  // Click outside to close
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        const trigger = document.getElementById("filters-trigger-btn");
        if (trigger?.contains(e.target as Node)) return;
        setFiltersOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [filtersOpen, setFiltersOpen]);

  const destinations = useMemo(() => {
    const set = new Set<string>();
    for (const r of requests) {
      if (r.primaryDestination) set.add(r.primaryDestination);
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [requests]);

  const approvers = useMemo(() => {
    const set = new Set<string>();
    for (const r of requests) {
      if (r.approver) set.add(r.approver);
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [requests]);

  const toggleStatus = useCallback((status: TravelRequestStatus) => {
    setDraft((prev) => ({
      ...prev,
      statuses: prev.statuses.includes(status)
        ? prev.statuses.filter((s) => s !== status)
        : [...prev.statuses, status],
    }));
  }, []);

  const activeCount = useMemo(() => {
    let count = 0;
    if (draft.statuses.length > 0) count += draft.statuses.length;
    if (draft.destination) count++;
    if (draft.dateFrom || draft.dateTo) count++;
    if (draft.approver) count++;
    if (draft.sortBy !== "updated_newest") count++;
    return count;
  }, [draft]);

  const handleClearAll = () => {
    setDraft(EMPTY_FILTERS);
  };

  const handleCancel = () => {
    setFiltersOpen(false);
  };

  const handleApply = () => {
    setAdvancedFilters(draft);
    setFiltersOpen(false);
  };

  return (
    <dialog
      ref={panelRef}
      open
      aria-label="Advanced filters"
      className="absolute left-0 top-full z-50 mt-2 w-[490px] rounded-xl border border-gray-200 bg-white shadow-lg"
      style={{ fontFamily: 'Arial, "Helvetica Neue", Helvetica, sans-serif' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 px-6 pt-5 pb-4">
        <h2 className="text-lg font-semibold text-[#001E60]">Filters</h2>
        <button
          ref={firstFocusableRef}
          onClick={handleClearAll}
          className="text-sm font-medium text-[#004C97] hover:underline focus:outline-none focus:ring-2 focus:ring-[#004C97] focus:ring-offset-2 rounded"
          type="button"
        >
          Clear all
        </button>
      </div>

      <div className="px-6 py-4 space-y-5">
        {/* Status section */}
        <fieldset>
          <legend className="text-sm font-semibold text-[#001E60] mb-3">Status</legend>
          <div className="grid grid-cols-3 gap-x-4 gap-y-2.5">
            {ALL_STATUSES.map((status) => (
              <Label
                key={status}
                className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer"
              >
                <Checkbox
                  checked={draft.statuses.includes(status)}
                  onCheckedChange={() => toggleStatus(status)}
                  aria-label={STATUS_LABELS[status]}
                />
                <span className="truncate">{STATUS_LABELS[status]}</span>
              </Label>
            ))}
          </div>
        </fieldset>

        {/* Destination + Travel Dates row */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="filter-destination"
              className="mb-1.5 block text-sm font-semibold text-[#001E60]"
            >
              Destination
            </label>
            <div className="relative">
              <select
                id="filter-destination"
                value={draft.destination}
                onChange={(e) => setDraft({ ...draft, destination: e.target.value })}
                className="h-9 w-full appearance-none rounded-lg border border-gray-300 bg-white px-3 pr-8 text-sm text-gray-900 focus:border-[#004C97] focus:outline-none focus:ring-2 focus:ring-[#004C97]/30"
              >
                <option value="">Select country or city...</option>
                {destinations.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          <div>
            <label
              htmlFor="filter-date-from"
              className="mb-1.5 block text-sm font-semibold text-[#001E60]"
            >
              Travel Dates
            </label>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <input
                  id="filter-date-from"
                  type="date"
                  value={draft.dateFrom}
                  onChange={(e) => setDraft({ ...draft, dateFrom: e.target.value })}
                  className="h-9 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 focus:border-[#004C97] focus:outline-none focus:ring-2 focus:ring-[#004C97]/30"
                  aria-label="Travel date from"
                  placeholder="Start"
                />
              </div>
              <span className="text-gray-400 text-xs" aria-hidden="true">–</span>
              <div className="relative flex-1">
                <input
                  id="filter-date-to"
                  type="date"
                  value={draft.dateTo}
                  onChange={(e) => setDraft({ ...draft, dateTo: e.target.value })}
                  className="h-9 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 focus:border-[#004C97] focus:outline-none focus:ring-2 focus:ring-[#004C97]/30"
                  aria-label="Travel date to"
                  placeholder="End"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Approver + Sort By row */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="filter-approver"
              className="mb-1.5 block text-sm font-semibold text-[#001E60]"
            >
              Approver
            </label>
            <div className="relative">
              <select
                id="filter-approver"
                value={draft.approver}
                onChange={(e) => setDraft({ ...draft, approver: e.target.value })}
                className="h-9 w-full appearance-none rounded-lg border border-gray-300 bg-white px-3 pr-8 text-sm text-gray-900 focus:border-[#004C97] focus:outline-none focus:ring-2 focus:ring-[#004C97]/30"
              >
                <option value="">All approvers</option>
                {approvers.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
              {draft.approver ? (
                <button
                  type="button"
                  onClick={() => setDraft({ ...draft, approver: "" })}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-0.5 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#004C97]"
                  aria-label="Clear approver filter"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              ) : (
                <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor="filter-sort"
              className="mb-1.5 block text-sm font-semibold text-[#001E60]"
            >
              Sort By
            </label>
            <div className="relative">
              <select
                id="filter-sort"
                value={draft.sortBy}
                onChange={(e) =>
                  setDraft({ ...draft, sortBy: e.target.value as SortOption })
                }
                className="h-9 w-full appearance-none rounded-lg border border-gray-300 bg-white px-3 pr-8 text-sm text-gray-900 focus:border-[#004C97] focus:outline-none focus:ring-2 focus:ring-[#004C97]/30"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {SORT_LABELS[opt]}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-end gap-3 border-t border-gray-100 px-6 py-4">
        <Button
          variant="outline"
          onClick={handleCancel}
          type="button"
        >
          Cancel
        </Button>
        <button
          onClick={handleApply}
          type="button"
          className="inline-flex h-9 items-center justify-center rounded-lg bg-[#004C97] px-5 text-sm font-medium text-white hover:bg-[#003a75] focus:outline-none focus:ring-2 focus:ring-[#004C97] focus:ring-offset-2 transition-colors"
        >
          Apply ({activeCount})
        </button>
      </div>
    </dialog>
  );
}
