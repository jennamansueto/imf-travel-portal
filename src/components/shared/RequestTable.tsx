"use client";

import { useRouter } from "next/navigation";
import { MapPin, Calendar } from "lucide-react";
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
import type { TravelRequest } from "@/types";
import { format } from "date-fns";

export type ColumnKey =
  | "travelReqNumber"
  | "traveler"
  | "department"
  | "destination"
  | "dates"
  | "status"
  | "approver"
  | "updated"
  | "submitted";

interface Column {
  key: ColumnKey;
  label: string;
}

interface RequestTableProps {
  requests: TravelRequest[];
  columns: Column[];
  emptyMessage?: string;
}

function CellContent({ column, req }: { column: ColumnKey; req: TravelRequest }) {
  switch (column) {
    case "travelReqNumber":
      return (
        <span className="font-medium text-[#004C97]">{req.travelReqNumber}</span>
      );
    case "traveler":
      return (
        <div>
          <p className="font-medium">{req.traveler.name}</p>
          <p className="text-xs text-gray-500">{req.traveler.employeeId}</p>
        </div>
      );
    case "department":
      return <span className="text-sm text-gray-600">{req.traveler.department}</span>;
    case "destination":
      return (
        <div className="flex items-center gap-1.5">
          <MapPin className="h-3.5 w-3.5 text-gray-400" />
          {req.primaryDestination}
        </div>
      );
    case "dates":
      return (
        <div className="flex items-center gap-1.5 text-sm text-gray-600">
          <Calendar className="h-3.5 w-3.5 text-gray-400" />
          {req.startDate ? format(new Date(req.startDate), "MMM d") : "—"} –{" "}
          {req.endDate ? format(new Date(req.endDate), "MMM d, yyyy") : "—"}
        </div>
      );
    case "status":
      return <StatusBadge status={req.status} />;
    case "approver":
      return <span className="text-sm text-gray-600">{req.approver}</span>;
    case "updated":
      return (
        <span className="text-sm text-gray-500">
          {format(new Date(req.updatedAt), "MMM d, h:mm a")}
        </span>
      );
    case "submitted":
      return (
        <span className="text-sm text-gray-500">
          {format(new Date(req.updatedAt), "MMM d, h:mm a")}
        </span>
      );
    default:
      return null;
  }
}

export function RequestTable({ requests, columns, emptyMessage = "No requests found" }: RequestTableProps) {
  const router = useRouter();

  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50">
            {columns.map((col) => (
              <TableHead key={col.key} className="font-semibold text-gray-700">
                {col.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="py-8 text-center text-gray-500">
                {emptyMessage}
              </TableCell>
            </TableRow>
          ) : (
            requests.map((req) => (
              <TableRow
                key={req.id}
                className="cursor-pointer hover:bg-slate-50/80 transition-colors focus-visible:bg-slate-50/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#004C97]/50"
                tabIndex={0}
                role="row"
                aria-label={`View request ${req.travelReqNumber}`}
                onClick={() => router.push(`/requests/${req.id}`)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    router.push(`/requests/${req.id}`);
                  }
                }}
              >
                {columns.map((col) => (
                  <TableCell key={col.key}>
                    <CellContent column={col.key} req={req} />
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </Card>
  );
}
