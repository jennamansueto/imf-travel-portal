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
  MapPin,
  Calendar,
} from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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

export function AdminDashboard() {
  const { requests } = useApp();
  const router = useRouter();
  const [viewMode, setViewMode] = useState<"kanban" | "table">("table");

  const metrics = useMemo(() => {
    const pending = requests.filter(
      (r) => r.status === "pending_approval"
    ).length;
    const overdue = requests.filter((r) => {
      if (r.status !== "pending_approval") return false;
      const submitted = new Date(r.updatedAt);
      const now = new Date();
      return (now.getTime() - submitted.getTime()) / 86400000 > 3;
    }).length;
    const unPending = requests.filter(
      (r) => r.status === "sent_to_un" || r.status === "un_processing"
    ).length;
    return { total: requests.length, pending, overdue, unPending };
  }, [requests]);

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

      {/* Metrics row */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-4 py-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50">
              <BarChart3 className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Requests</p>
              <p className="text-2xl font-semibold">{metrics.total}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 py-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-50">
              <Clock className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Pending Approval</p>
              <p className="text-2xl font-semibold">{metrics.pending}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 py-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-50">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">
                Overdue (&gt;3 days)
              </p>
              <p className="text-2xl font-semibold">{metrics.overdue}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 py-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-50">
              <Shield className="h-6 w-6 text-indigo-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">UN Clearance Pending</p>
              <p className="text-2xl font-semibold">{metrics.unPending}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Kanban or Table view */}
      {viewMode === "kanban" ? (
        <div className="flex gap-3 overflow-x-auto pb-4">
          {kanbanColumns.map((status) => {
            const items = requests.filter((r) => r.status === status);
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
        <Card>
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50">
                <TableHead className="font-semibold text-gray-700">Travel Req #</TableHead>
                <TableHead className="font-semibold text-gray-700">Traveler</TableHead>
                <TableHead className="font-semibold text-gray-700">Department</TableHead>
                <TableHead className="font-semibold text-gray-700">Destination</TableHead>
                <TableHead className="font-semibold text-gray-700">Dates</TableHead>
                <TableHead className="font-semibold text-gray-700">Status</TableHead>
                <TableHead className="font-semibold text-gray-700">Approver</TableHead>
                <TableHead className="font-semibold text-gray-700">Updated</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map((req) => (
                <TableRow
                  key={req.id}
                  className="cursor-pointer hover:bg-slate-50/80 transition-colors"
                  onClick={() => router.push(`/requests/${req.id}`)}
                >
                  <TableCell className="font-medium text-[#0073CF]">
                    {req.travelReqNumber}
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{req.traveler.name}</p>
                      <p className="text-xs text-gray-500">
                        {req.traveler.employeeId}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {req.traveler.department}
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
                      {req.startDate ? format(new Date(req.startDate), "MMM d") : "—"} –{" "}
                      {req.endDate ? format(new Date(req.endDate), "MMM d") : "—"}
                    </div>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={req.status} />
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {req.approver}
                  </TableCell>
                  <TableCell className="text-sm text-gray-500">
                    {format(new Date(req.updatedAt), "MMM d")}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  );
}
