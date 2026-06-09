"use client";

import { useState, useMemo, useCallback } from "react";
import {
  Search,
  SlidersHorizontal,
  X,
  ChevronDown,
  ChevronUp,
  Calendar,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import type { TravelRequest, TravelRequestStatus } from "@/types";
import { STATUS_LABELS } from "@/types";

export interface FilterState {
  searchQuery: string;
  statuses: TravelRequestStatus[];
  startDateFrom: string;
  startDateTo: string;
  destination: string;
  approver: string;
  department: string;
}

const EMPTY_FILTERS: FilterState = {
  searchQuery: "",
  statuses: [],
  startDateFrom: "",
  startDateTo: "",
  destination: "",
  approver: "",
  department: "",
};

interface AdvancedFiltersProps {
  requests: TravelRequest[];
  onFilteredRequestsChange: (filtered: TravelRequest[]) => void;
  showDepartment?: boolean;
}

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

export function AdvancedFilters({
  requests,
  onFilteredRequestsChange,
  showDepartment = false,
}: AdvancedFiltersProps) {
  const [filters, setFilters] = useState<FilterState>(EMPTY_FILTERS);
  const [panelOpen, setPanelOpen] = useState(false);

  const uniqueApprovers = useMemo(
    () => [...new Set(requests.map((r) => r.approver))].sort(),
    [requests]
  );

  const uniqueDepartments = useMemo(
    () => [...new Set(requests.map((r) => r.traveler.department))].sort(),
    [requests]
  );

  const filteredRequests = useMemo(() => {
    const result = requests.filter((r) => {
      if (filters.statuses.length > 0 && !filters.statuses.includes(r.status))
        return false;

      if (filters.searchQuery) {
        const q = filters.searchQuery.toLowerCase();
        const matchesSearch =
          r.travelReqNumber.toLowerCase().includes(q) ||
          r.primaryDestination.toLowerCase().includes(q) ||
          r.traveler.name.toLowerCase().includes(q) ||
          r.traveler.department.toLowerCase().includes(q);
        if (!matchesSearch) return false;
      }

      if (filters.startDateFrom && r.startDate < filters.startDateFrom)
        return false;
      if (filters.startDateTo && r.startDate > filters.startDateTo)
        return false;

      if (filters.destination) {
        const dest = filters.destination.toLowerCase();
        if (!r.primaryDestination.toLowerCase().includes(dest)) return false;
      }

      if (filters.approver && r.approver !== filters.approver) return false;

      if (
        filters.department &&
        r.traveler.department !== filters.department
      )
        return false;

      return true;
    });

    onFilteredRequestsChange(result);
    return result;
  }, [requests, filters, onFilteredRequestsChange]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.statuses.length > 0) count++;
    if (filters.startDateFrom || filters.startDateTo) count++;
    if (filters.destination) count++;
    if (filters.approver) count++;
    if (filters.department) count++;
    return count;
  }, [filters]);

  const toggleStatus = useCallback((status: TravelRequestStatus) => {
    setFilters((prev) => ({
      ...prev,
      statuses: prev.statuses.includes(status)
        ? prev.statuses.filter((s) => s !== status)
        : [...prev.statuses, status],
    }));
  }, []);

  const updateFilter = useCallback(
    <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const clearAllFilters = useCallback(() => {
    setFilters(EMPTY_FILTERS);
  }, []);

  const removeStatusFilter = useCallback((status: TravelRequestStatus) => {
    setFilters((prev) => ({
      ...prev,
      statuses: prev.statuses.filter((s) => s !== status),
    }));
  }, []);

  const hasActiveFilters =
    activeFilterCount > 0 || filters.searchQuery.length > 0;

  return (
    <div className="space-y-3">
      {/* Search bar + toggle */}
      <Card>
        <CardContent className="py-3">
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search by requisition #, destination, traveler, or department..."
                value={filters.searchQuery}
                onChange={(e) => updateFilter("searchQuery", e.target.value)}
                className="pl-9"
                aria-label="Search travel requests"
              />
            </div>
            <Button
              variant={panelOpen ? "default" : "outline"}
              size="sm"
              onClick={() => setPanelOpen(!panelOpen)}
              className={panelOpen ? "bg-[#002855] hover:bg-[#001a3a]" : ""}
              aria-label="Toggle advanced filters"
              aria-expanded={panelOpen}
            >
              <SlidersHorizontal className="mr-1.5 h-4 w-4" />
              Filters
              {activeFilterCount > 0 && (
                <Badge
                  variant="secondary"
                  className="ml-1.5 h-5 min-w-[20px] bg-[#0073CF] text-white"
                >
                  {activeFilterCount}
                </Badge>
              )}
              {panelOpen ? (
                <ChevronUp className="ml-1 h-3.5 w-3.5" />
              ) : (
                <ChevronDown className="ml-1 h-3.5 w-3.5" />
              )}
            </Button>
            {hasActiveFilters && (
              <Button variant="outline" size="sm" onClick={clearAllFilters}>
                <X className="mr-1 h-3.5 w-3.5" />
                Clear all
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Collapsible advanced filter panel */}
      {panelOpen && (
        <Card className="animate-in fade-in slide-in-from-top-2 duration-200">
          <CardContent className="py-4">
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {/* Status filter */}
              <div className="sm:col-span-2 lg:col-span-4">
                <Label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Status
                </Label>
                <div className="flex flex-wrap gap-2">
                  {ALL_STATUSES.map((status) => {
                    const isSelected = filters.statuses.includes(status);
                    return (
                      <button
                        key={status}
                        onClick={() => toggleStatus(status)}
                        className={`flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs font-medium transition-all ${
                          isSelected
                            ? "border-[#0073CF] bg-blue-50 text-[#0073CF]"
                            : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                        }`}
                        aria-pressed={isSelected}
                      >
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() => toggleStatus(status)}
                          className="h-3.5 w-3.5"
                          aria-hidden
                          tabIndex={-1}
                        />
                        {STATUS_LABELS[status]}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Date range */}
              <div>
                <Label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Travel Date From
                </Label>
                <div className="relative">
                  <Calendar className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  <Input
                    type="date"
                    value={filters.startDateFrom}
                    onChange={(e) =>
                      updateFilter("startDateFrom", e.target.value)
                    }
                    className="pl-8"
                    aria-label="Travel date from"
                  />
                </div>
              </div>

              <div>
                <Label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Travel Date To
                </Label>
                <div className="relative">
                  <Calendar className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  <Input
                    type="date"
                    value={filters.startDateTo}
                    onChange={(e) =>
                      updateFilter("startDateTo", e.target.value)
                    }
                    className="pl-8"
                    aria-label="Travel date to"
                  />
                </div>
              </div>

              {/* Destination */}
              <div>
                <Label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Destination
                </Label>
                <Input
                  placeholder="e.g. Kenya, Ethiopia..."
                  value={filters.destination}
                  onChange={(e) => updateFilter("destination", e.target.value)}
                  aria-label="Filter by destination"
                />
              </div>

              {/* Approver */}
              <div>
                <Label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Approver
                </Label>
                <select
                  value={filters.approver}
                  onChange={(e) => updateFilter("approver", e.target.value)}
                  className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                  aria-label="Filter by approver"
                >
                  <option value="">All approvers</option>
                  {uniqueApprovers.map((a) => (
                    <option key={a} value={a}>
                      {a}
                    </option>
                  ))}
                </select>
              </div>

              {/* Department (conditional) */}
              {showDepartment && (
                <div>
                  <Label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Department
                  </Label>
                  <select
                    value={filters.department}
                    onChange={(e) =>
                      updateFilter("department", e.target.value)
                    }
                    className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                    aria-label="Filter by department"
                  >
                    <option value="">All departments</option>
                    {uniqueDepartments.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Active filter chips */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-gray-500">
            {filteredRequests.length} result{filteredRequests.length !== 1 ? "s" : ""}
          </span>

          {filters.statuses.map((status) => (
            <button
              key={status}
              onClick={() => removeStatusFilter(status)}
              className="inline-flex items-center gap-1 rounded-full border border-blue-200 bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700 transition-colors hover:bg-blue-100"
            >
              {STATUS_LABELS[status]}
              <X className="h-3 w-3" />
            </button>
          ))}

          {(filters.startDateFrom || filters.startDateTo) && (
            <button
              onClick={() => {
                updateFilter("startDateFrom", "");
                updateFilter("startDateTo", "");
              }}
              className="inline-flex items-center gap-1 rounded-full border border-blue-200 bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700 transition-colors hover:bg-blue-100"
            >
              Dates: {filters.startDateFrom || "any"} – {filters.startDateTo || "any"}
              <X className="h-3 w-3" />
            </button>
          )}

          {filters.destination && (
            <button
              onClick={() => updateFilter("destination", "")}
              className="inline-flex items-center gap-1 rounded-full border border-blue-200 bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700 transition-colors hover:bg-blue-100"
            >
              Destination: {filters.destination}
              <X className="h-3 w-3" />
            </button>
          )}

          {filters.approver && (
            <button
              onClick={() => updateFilter("approver", "")}
              className="inline-flex items-center gap-1 rounded-full border border-blue-200 bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700 transition-colors hover:bg-blue-100"
            >
              Approver: {filters.approver}
              <X className="h-3 w-3" />
            </button>
          )}

          {filters.department && (
            <button
              onClick={() => updateFilter("department", "")}
              className="inline-flex items-center gap-1 rounded-full border border-blue-200 bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700 transition-colors hover:bg-blue-100"
            >
              Department: {filters.department}
              <X className="h-3 w-3" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
