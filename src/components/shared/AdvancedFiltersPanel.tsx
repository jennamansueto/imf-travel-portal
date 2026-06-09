"use client";

import { useState, useMemo } from "react";
import { X } from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import type { TravelRequestStatus, AdvancedFilters, SortOption } from "@/types";
import { STATUS_LABELS, SORT_OPTIONS, DEFAULT_FILTERS } from "@/types";

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

interface AdvancedFiltersPanelProps {
  onApply: (filters: AdvancedFilters) => void;
  onCancel: () => void;
  currentFilters: AdvancedFilters;
}

export function AdvancedFiltersPanel({
  onApply,
  onCancel,
  currentFilters,
}: AdvancedFiltersPanelProps) {
  const { requests } = useApp();
  const [draft, setDraft] = useState<AdvancedFilters>({ ...currentFilters });

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

  const activeCount = useMemo(() => {
    let count = 0;
    if (draft.statuses.length > 0) count += draft.statuses.length;
    if (draft.destination) count++;
    if (draft.dateFrom || draft.dateTo) count++;
    if (draft.approver) count++;
    return count;
  }, [draft]);

  const toggleStatus = (status: TravelRequestStatus) => {
    setDraft((prev) => ({
      ...prev,
      statuses: prev.statuses.includes(status)
        ? prev.statuses.filter((s) => s !== status)
        : [...prev.statuses, status],
    }));
  };

  const handleClearAll = () => {
    setDraft({ ...DEFAULT_FILTERS });
  };

  return (
    <div className="w-[520px] rounded-xl border border-gray-200 bg-white p-5 shadow-lg">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-base font-semibold text-gray-900">Filters</h3>
        <button
          onClick={handleClearAll}
          className="text-sm font-medium text-blue-600 hover:text-blue-800"
        >
          Clear all
        </button>
      </div>

      {/* Status checkboxes - 3x3 grid */}
      <div className="mb-4">
        <Label className="mb-2 block text-sm font-medium text-gray-700">
          Status
        </Label>
        <div className="grid grid-cols-3 gap-x-4 gap-y-2">
          {ALL_STATUSES.map((status) => (
            <label
              key={status}
              className="flex items-center gap-2 cursor-pointer"
            >
              <Checkbox
                checked={draft.statuses.includes(status)}
                onCheckedChange={() => toggleStatus(status)}
              />
              <span className="text-sm text-gray-700 truncate">
                {STATUS_LABELS[status]}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Destination & Travel Dates row */}
      <div className="mb-4 grid grid-cols-2 gap-4">
        <div>
          <Label className="mb-1.5 block text-sm font-medium text-gray-700">
            Destination
          </Label>
          <select
            value={draft.destination || ""}
            onChange={(e) =>
              setDraft((prev) => ({
                ...prev,
                destination: e.target.value || null,
              }))
            }
            className="h-9 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-700 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          >
            <option value="">Select country or city...</option>
            {destinations.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label className="mb-1.5 block text-sm font-medium text-gray-700">
            Travel Dates
          </Label>
          <div className="flex items-center gap-1.5">
            <input
              type="date"
              value={draft.dateFrom || ""}
              onChange={(e) =>
                setDraft((prev) => ({
                  ...prev,
                  dateFrom: e.target.value || null,
                }))
              }
              className="h-9 w-full rounded-lg border border-gray-300 bg-white px-2 text-sm text-gray-700 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              placeholder="From"
            />
            <span className="text-gray-400 text-xs">–</span>
            <input
              type="date"
              value={draft.dateTo || ""}
              onChange={(e) =>
                setDraft((prev) => ({
                  ...prev,
                  dateTo: e.target.value || null,
                }))
              }
              className="h-9 w-full rounded-lg border border-gray-300 bg-white px-2 text-sm text-gray-700 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              placeholder="To"
            />
          </div>
        </div>
      </div>

      {/* Approver & Sort By row */}
      <div className="mb-5 grid grid-cols-2 gap-4">
        <div>
          <Label className="mb-1.5 block text-sm font-medium text-gray-700">
            Approver
          </Label>
          <div className="relative">
            <select
              value={draft.approver || ""}
              onChange={(e) =>
                setDraft((prev) => ({
                  ...prev,
                  approver: e.target.value || null,
                }))
              }
              className="h-9 w-full rounded-lg border border-gray-300 bg-white px-3 pr-8 text-sm text-gray-700 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            >
              <option value="">All approvers</option>
              {approvers.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
            {draft.approver && (
              <button
                onClick={() =>
                  setDraft((prev) => ({ ...prev, approver: null }))
                }
                className="absolute right-7 top-1/2 -translate-y-1/2 rounded p-0.5 text-gray-400 hover:text-gray-600"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>
        <div>
          <Label className="mb-1.5 block text-sm font-medium text-gray-700">
            Sort By
          </Label>
          <select
            value={draft.sortBy}
            onChange={(e) =>
              setDraft((prev) => ({
                ...prev,
                sortBy: e.target.value as SortOption,
              }))
            }
            className="h-9 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-700 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-end gap-3 border-t border-gray-200 pt-4">
        <Button variant="outline" onClick={onCancel} className="px-6">
          Cancel
        </Button>
        <Button
          onClick={() => onApply(draft)}
          className="bg-[#002855] px-6 hover:bg-[#001a3a]"
        >
          Apply ({activeCount})
        </Button>
      </div>
    </div>
  );
}
