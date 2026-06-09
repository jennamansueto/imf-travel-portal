"use client";

import { useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Plus, Filter } from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RequestTable } from "@/components/shared/RequestTable";
import { AdvancedFilters } from "@/components/shared/AdvancedFilters";
import type { ColumnKey } from "@/components/shared/RequestTable";
import type { TravelRequest, TravelRequestStatus } from "@/types";
import { STATUS_LABELS } from "@/types";

const statusGroups: { key: TravelRequestStatus; color: string }[] = [
  { key: "draft", color: "bg-slate-500" },
  { key: "pending_approval", color: "bg-blue-500" },
  { key: "returned_by_approver", color: "bg-amber-500" },
  { key: "approved", color: "bg-green-500" },
  { key: "sent_to_un", color: "bg-indigo-500" },
  { key: "un_processing", color: "bg-purple-500" },
  { key: "un_approved", color: "bg-emerald-500" },
  { key: "un_rejected", color: "bg-red-500" },
  { key: "returned_by_un", color: "bg-orange-500" },
];

const tableColumns: { key: ColumnKey; label: string }[] = [
  { key: "travelReqNumber", label: "Travel Req #" },
  { key: "destination", label: "Destination" },
  { key: "dates", label: "Dates" },
  { key: "status", label: "Status" },
  { key: "updated", label: "Last Updated" },
  { key: "approver", label: "Approver" },
];

export function RequestorDashboard() {
  const { requests, createNewRequest } = useApp();
  const router = useRouter();
  const [filteredRequests, setFilteredRequests] = useState<TravelRequest[]>(requests);
  const [loading] = useState(false);

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const s of statusGroups) {
      counts[s.key] = requests.filter((r) => r.status === s.key).length;
    }
    return counts;
  }, [requests]);

  const handleNewRequest = () => {
    const newReq = createNewRequest();
    router.push(`/requests/${newReq.id}`);
  };

  const handleFilteredRequestsChange = useCallback((filtered: TravelRequest[]) => {
    setFilteredRequests(filtered);
  }, []);

  return (
    <div className="animate-in fade-in duration-300">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            My Travel Requests
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage and track your travel requisitions
          </p>
        </div>
        <Button
          onClick={handleNewRequest}
          className="bg-[#002855] hover:bg-[#001a3a]"
        >
          <Plus className="mr-2 h-4 w-4" />
          New Travel Request
        </Button>
      </div>

      {/* Loading state for Fabric */}
      {loading && (
        <div className="mb-4 flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
          Loading from Fabric...
        </div>
      )}

      {/* Status summary cards */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-9">
        {statusGroups.map((s) => (
          <div
            key={s.key}
            className="rounded-lg border border-gray-200 bg-white p-3 text-left"
          >
            <div className="flex items-center gap-2">
              <div className={`h-2 w-2 rounded-full ${s.color}`} />
              <span className="text-xs text-gray-500 truncate">
                {STATUS_LABELS[s.key]}
              </span>
            </div>
            <p className="mt-1 text-xl font-semibold text-gray-900">
              {statusCounts[s.key] || 0}
            </p>
          </div>
        ))}
      </div>

      {/* Advanced filters */}
      <div className="mb-4">
        <AdvancedFilters
          requests={requests}
          onFilteredRequestsChange={handleFilteredRequestsChange}
        />
      </div>

      {/* Request table */}
      {filteredRequests.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-gray-500">
            <div className="flex flex-col items-center gap-2">
              <Filter className="h-8 w-8 text-gray-300" />
              <p className="font-medium">No requests found</p>
              <p className="text-sm">
                Try adjusting your filters or create a new request
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <RequestTable requests={filteredRequests} columns={tableColumns} />
      )}
    </div>
  );
}
