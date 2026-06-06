"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Plus, Search, Filter, Calendar, MapPin } from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { TravelRequestStatus } from "@/types";
import { STATUS_LABELS } from "@/types";
import { format } from "date-fns";

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

export function RequestorDashboard() {
  const { requests, createNewRequest } = useApp();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<TravelRequestStatus | "all">(
    "all"
  );
  const [loading] = useState(false);

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const s of statusGroups) {
      counts[s.key] = requests.filter((r) => r.status === s.key).length;
    }
    return counts;
  }, [requests]);

  const filteredRequests = useMemo(() => {
    return requests.filter((r) => {
      if (statusFilter !== "all" && r.status !== statusFilter) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          r.travelReqNumber.toLowerCase().includes(q) ||
          r.primaryDestination.toLowerCase().includes(q) ||
          r.traveler.name.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [requests, statusFilter, searchQuery]);

  const handleNewRequest = () => {
    const newReq = createNewRequest();
    router.push(`/requests/${newReq.id}`);
  };

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
          <button
            key={s.key}
            onClick={() =>
              setStatusFilter(statusFilter === s.key ? "all" : s.key)
            }
            className={`rounded-lg border p-3 text-left transition-all hover:shadow-sm ${
              statusFilter === s.key
                ? "border-[#0073CF] bg-blue-50 ring-1 ring-[#0073CF]"
                : "border-gray-200 bg-white"
            }`}
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
          </button>
        ))}
      </div>

      {/* Filter bar */}
      <Card className="mb-4">
        <CardContent className="flex items-center gap-3 py-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search by requisition #, destination, or traveler..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
              aria-label="Search travel requests"
            />
          </div>
          {statusFilter !== "all" && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setStatusFilter("all")}
            >
              Clear filter
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Request table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50">
              <TableHead className="font-semibold text-gray-700">
                Travel Req #
              </TableHead>
              <TableHead className="font-semibold text-gray-700">
                Destination
              </TableHead>
              <TableHead className="font-semibold text-gray-700">
                Dates
              </TableHead>
              <TableHead className="font-semibold text-gray-700">
                Status
              </TableHead>
              <TableHead className="font-semibold text-gray-700">
                Last Updated
              </TableHead>
              <TableHead className="font-semibold text-gray-700">
                Approver
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRequests.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="py-12 text-center text-gray-500"
                >
                  <div className="flex flex-col items-center gap-2">
                    <Filter className="h-8 w-8 text-gray-300" />
                    <p className="font-medium">No requests found</p>
                    <p className="text-sm">
                      Try adjusting your filters or create a new request
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredRequests.map((req) => (
                <TableRow
                  key={req.id}
                  className="cursor-pointer hover:bg-slate-50/80 transition-colors"
                  onClick={() => router.push(`/requests/${req.id}`)}
                >
                  <TableCell className="font-medium text-[#0073CF]">
                    {req.travelReqNumber}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-gray-400" />
                      {req.primaryDestination}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-sm text-gray-600">
                      <Calendar className="h-3.5 w-3.5 text-gray-400" />
                      {req.startDate
                        ? format(new Date(req.startDate), "MMM d")
                        : "—"}{" "}
                      –{" "}
                      {req.endDate
                        ? format(new Date(req.endDate), "MMM d, yyyy")
                        : "—"}
                    </div>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={req.status} />
                  </TableCell>
                  <TableCell className="text-sm text-gray-500">
                    {format(new Date(req.updatedAt), "MMM d, h:mm a")}
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {req.approver}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
