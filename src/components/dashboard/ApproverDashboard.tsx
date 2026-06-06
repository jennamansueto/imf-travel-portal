"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { ClipboardCheck, Clock, MapPin, Calendar, AlertCircle } from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export function ApproverDashboard() {
  const { requests } = useApp();
  const router = useRouter();

  const pendingRequests = useMemo(
    () => requests.filter((r) => r.status === "pending_approval"),
    [requests]
  );

  const recentDecisions = useMemo(
    () =>
      requests.filter(
        (r) =>
          r.status === "approved" ||
          r.status === "returned_by_approver" ||
          r.status === "sent_to_un"
      ),
    [requests]
  );

  return (
    <div className="animate-in fade-in duration-300">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Review Queue</h1>
        <p className="mt-1 text-sm text-gray-500">
          Travel requests awaiting your approval
        </p>
      </div>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-4 py-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50">
              <ClipboardCheck className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Pending Review</p>
              <p className="text-2xl font-semibold">{pendingRequests.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 py-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-50">
              <Clock className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Avg. Review Time</p>
              <p className="text-2xl font-semibold">2.3 days</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 py-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-50">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Overdue (&gt;3 days)</p>
              <p className="text-2xl font-semibold">1</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Requests */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">
            Pending Approval
            <Badge variant="secondary" className="ml-2">
              {pendingRequests.length}
            </Badge>
          </CardTitle>
        </CardHeader>
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50">
              <TableHead className="font-semibold text-gray-700">Travel Req #</TableHead>
              <TableHead className="font-semibold text-gray-700">Traveler</TableHead>
              <TableHead className="font-semibold text-gray-700">Destination</TableHead>
              <TableHead className="font-semibold text-gray-700">Dates</TableHead>
              <TableHead className="font-semibold text-gray-700">Submitted</TableHead>
              <TableHead className="font-semibold text-gray-700">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pendingRequests.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-8 text-center text-gray-500">
                  No requests pending approval
                </TableCell>
              </TableRow>
            ) : (
              pendingRequests.map((req) => (
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
                      <p className="text-xs text-gray-500">{req.traveler.employeeId}</p>
                    </div>
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
                      {format(new Date(req.startDate), "MMM d")} –{" "}
                      {format(new Date(req.endDate), "MMM d")}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-gray-500">
                    {format(new Date(req.updatedAt), "MMM d, h:mm a")}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={req.status} />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Recent Decisions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recent Decisions</CardTitle>
        </CardHeader>
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50">
              <TableHead className="font-semibold text-gray-700">Travel Req #</TableHead>
              <TableHead className="font-semibold text-gray-700">Traveler</TableHead>
              <TableHead className="font-semibold text-gray-700">Destination</TableHead>
              <TableHead className="font-semibold text-gray-700">Decision</TableHead>
              <TableHead className="font-semibold text-gray-700">Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentDecisions.map((req) => (
              <TableRow
                key={req.id}
                className="cursor-pointer hover:bg-slate-50/80 transition-colors"
                onClick={() => router.push(`/requests/${req.id}`)}
              >
                <TableCell className="font-medium text-[#0073CF]">
                  {req.travelReqNumber}
                </TableCell>
                <TableCell>{req.traveler.name}</TableCell>
                <TableCell>{req.primaryDestination}</TableCell>
                <TableCell>
                  <StatusBadge status={req.status} />
                </TableCell>
                <TableCell className="text-sm text-gray-500">
                  {format(new Date(req.updatedAt), "MMM d, h:mm a")}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
