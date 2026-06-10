"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { Shield, MapPin } from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";

const clearanceStatuses = [
  "sent_to_un",
  "un_processing",
  "un_approved",
  "un_rejected",
  "returned_by_un",
] as const;

export default function ClearancePage() {
  const { requests } = useApp();
  const router = useRouter();

  const clearanceRequests = useMemo(
    () =>
      requests.filter((r) =>
        (clearanceStatuses as readonly string[]).includes(r.status)
      ),
    [requests]
  );

  return (
    <div className="animate-in fade-in duration-300">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">
          UN Security Clearance
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Track clearance status for all travel requests
        </p>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50">
              <TableHead className="font-semibold text-gray-700">Travel Req #</TableHead>
              <TableHead className="font-semibold text-gray-700">Traveler</TableHead>
              <TableHead className="font-semibold text-gray-700">Destination</TableHead>
              <TableHead className="font-semibold text-gray-700">Dates</TableHead>
              <TableHead className="font-semibold text-gray-700">Status</TableHead>
              <TableHead className="font-semibold text-gray-700">UN Reference</TableHead>
              <TableHead className="font-semibold text-gray-700">Updated</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clearanceRequests.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="py-12 text-center text-gray-500">
                  <Shield className="mx-auto mb-2 h-8 w-8 text-gray-300" />
                  <p>No requests in UN clearance pipeline</p>
                </TableCell>
              </TableRow>
            ) : (
              clearanceRequests.map((req) => (
                <TableRow
                  key={req.id}
                  className="cursor-pointer hover:bg-slate-50/80 transition-colors"
                  onClick={() => router.push(`/requests/${req.id}/clearance`)}
                >
                  <TableCell className="font-medium text-[#004C97]">
                    {req.travelReqNumber}
                  </TableCell>
                  <TableCell>{req.traveler.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-gray-400" />
                      {req.primaryDestination}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {req.startDate ? format(new Date(req.startDate), "MMM d") : "—"} –{" "}
                    {req.endDate ? format(new Date(req.endDate), "MMM d") : "—"}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={req.status} />
                  </TableCell>
                  <TableCell className="font-mono text-xs text-gray-500">
                    {req.unReferenceNumber || "Pending"}
                  </TableCell>
                  <TableCell className="text-sm text-gray-500">
                    {format(new Date(req.updatedAt), "MMM d")}
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
