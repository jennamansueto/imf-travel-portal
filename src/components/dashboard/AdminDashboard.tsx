"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  BarChart3,
  Clock,
  AlertTriangle,
  Shield,
  LayoutGrid,
  List,
} from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/shared/StatCard";
import { RequestTable } from "@/components/shared/RequestTable";
import { FilterPills } from "@/components/shared/FilterPills";
import { useFilteredRequests, hasActiveFilters } from "@/hooks/useFilteredRequests";
import type { ColumnKey } from "@/components/shared/RequestTable";
import type { TravelRequestStatus } from "@/types";
import { STATUS_LABELS } from "@/types";

const kanbanColumns: TravelRequestStatus[] = [
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

const tableColumns: { key: ColumnKey; label: string }[] = [
  { key: "travelReqNumber", label: "Travel Req #" },
  { key: "traveler", label: "Traveler" },
  { key: "department", label: "Department" },
  { key: "destination", label: "Destination" },
  { key: "dates", label: "Dates" },
  { key: "status", label: "Status" },
  { key: "approver", label: "Approver" },
  { key: "updated", label: "Updated" },
];

export function AdminDashboard() {
  const { requests, advancedFilters } = useApp();
  const router = useRouter();
  const [viewMode, setViewMode] = useState<"kanban" | "table">("table");

  const filteredByAdvanced = useFilteredRequests(requests, advancedFilters);
  const filtersActive = hasActiveFilters(advancedFilters);
  const source = filtersActive ? filteredByAdvanced : requests;

  const metrics = useMemo(() => {
    const pending = source.filter(
      (r) => r.status === "pending_approval"
    ).length;
    const overdue = source.filter((r) => {
      if (r.status !== "pending_approval") return false;
      const submitted = new Date(r.updatedAt);
      const now = new Date();
      return (now.getTime() - submitted.getTime()) / 86400000 > 3;
    }).length;
    const unPending = source.filter(
      (r) => r.status === "sent_to_un" || r.status === "un_processing"
    ).length;
    return { total: source.length, pending, overdue, unPending };
  }, [source]);

  return (
    <div className="animate-in fade-in duration-300">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Administrator Dashboard
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Organization-wide travel request overview
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === "table" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("table")}
            className={viewMode === "table" ? "bg-[#002855]" : ""}
          >
            <List className="mr-1.5 h-4 w-4" />
            Table
          </Button>
          <Button
            variant={viewMode === "kanban" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("kanban")}
            className={viewMode === "kanban" ? "bg-[#002855]" : ""}
          >
            <LayoutGrid className="mr-1.5 h-4 w-4" />
            Pipeline
          </Button>
        </div>
      </div>

      {/* Active filter pills */}
      <FilterPills />

      {/* Metrics row */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-4">
        <StatCard
          icon={BarChart3}
          iconColor="text-blue-600"
          iconBg="bg-blue-50"
          label="Total Requests"
          value={metrics.total}
        />
        <StatCard
          icon={Clock}
          iconColor="text-amber-600"
          iconBg="bg-amber-50"
          label="Pending Approval"
          value={metrics.pending}
        />
        <StatCard
          icon={AlertTriangle}
          iconColor="text-red-600"
          iconBg="bg-red-50"
          label="Overdue (>3 days)"
          value={metrics.overdue}
        />
        <StatCard
          icon={Shield}
          iconColor="text-indigo-600"
          iconBg="bg-indigo-50"
          label="UN Clearance Pending"
          value={metrics.unPending}
        />
      </div>

      {/* Kanban or Table view */}
      {viewMode === "kanban" ? (
        <div className="flex gap-3 overflow-x-auto pb-4">
          {kanbanColumns.map((status) => {
            const items = source.filter((r) => r.status === status);
            return (
              <div
                key={status}
                className="min-w-[220px] flex-shrink-0 rounded-lg border border-gray-200 bg-gray-50/50"
              >
                <div className="flex items-center justify-between border-b border-gray-200 px-3 py-2.5">
                  <span className="text-xs font-semibold text-gray-700">
                    {STATUS_LABELS[status]}
                  </span>
                  <Badge variant="secondary" className="text-xs">
                    {items.length}
                  </Badge>
                </div>
                <div className="space-y-2 p-2">
                  {items.map((req) => (
                    <button
                      key={req.id}
                      onClick={() => router.push(`/requests/${req.id}`)}
                      className="w-full rounded-md border border-gray-200 bg-white p-3 text-left shadow-sm transition-shadow hover:shadow-md"
                    >
                      <p className="text-xs font-semibold text-[#0073CF]">
                        {req.travelReqNumber}
                      </p>
                      <p className="mt-1 text-sm font-medium text-gray-900">
                        {req.traveler.name}
                      </p>
                      <p className="mt-0.5 text-xs text-gray-500">
                        {req.primaryDestination}
                      </p>
                    </button>
                  ))}
                  {items.length === 0 && (
                    <p className="py-4 text-center text-xs text-gray-400">
                      No requests
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <RequestTable requests={source} columns={tableColumns} />
      )}
    </div>
  );
}
