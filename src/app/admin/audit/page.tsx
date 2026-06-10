"use client";

import { useMemo, useState } from "react";
import { Download } from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";

export default function AuditPage() {
  const { requests } = useApp();
  const [filterAction, setFilterAction] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const allAuditEntries = useMemo(() => {
    const entries = requests.flatMap((req) =>
      req.auditTrail.map((entry) => ({
        ...entry,
        travelReqNumber: req.travelReqNumber,
        requestId: req.id,
      }))
    );
    return entries
      .filter((entry) => {
        if (filterAction !== "all" && entry.action !== filterAction)
          return false;
        if (searchQuery) {
          const q = searchQuery.toLowerCase();
          return (
            entry.actor.toLowerCase().includes(q) ||
            entry.action.toLowerCase().includes(q) ||
            entry.details.toLowerCase().includes(q) ||
            entry.travelReqNumber.toLowerCase().includes(q)
          );
        }
        return true;
      })
      .sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
  }, [requests, filterAction, searchQuery]);

  const uniqueActions = useMemo(() => {
    const actions = new Set<string>();
    requests.forEach((r) =>
      r.auditTrail.forEach((e) => actions.add(e.action))
    );
    return Array.from(actions).sort();
  }, [requests]);

  const exportAudit = () => {
    const csv = [
      "Timestamp,Travel Req #,Actor,Role,Action,Details,IP Address",
      ...allAuditEntries.map(
        (e) =>
          `"${e.timestamp}","${e.travelReqNumber}","${e.actor}","${e.actorRole}","${e.action}","${e.details.replace(/"/g, '""')}","${e.ipAddress}"`
      ),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "audit-trail-export.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="animate-in fade-in duration-300">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Audit Trail</h1>
          <p className="mt-1 text-sm text-gray-500">
            Complete event log across all travel requests
          </p>
        </div>
        <Button variant="outline" onClick={exportAudit}>
          <Download className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
      </div>

      <Card className="mb-4">
        <CardContent className="flex items-center gap-3 py-3">
          <Input
            placeholder="Search audit entries..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1"
          />
          <Select
            value={filterAction}
            onValueChange={(v) => setFilterAction(v ?? "all")}
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by action" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Actions</SelectItem>
              {uniqueActions.map((action) => (
                <SelectItem key={action} value={action}>
                  {action}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card>
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50">
              <TableHead className="font-semibold text-gray-700">Timestamp</TableHead>
              <TableHead className="font-semibold text-gray-700">Travel Req #</TableHead>
              <TableHead className="font-semibold text-gray-700">Actor</TableHead>
              <TableHead className="font-semibold text-gray-700">Action</TableHead>
              <TableHead className="font-semibold text-gray-700">Details</TableHead>
              <TableHead className="font-semibold text-gray-700">IP Address</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {allAuditEntries.map((entry) => (
              <TableRow key={entry.id}>
                <TableCell className="text-xs text-gray-500 whitespace-nowrap">
                  {format(new Date(entry.timestamp), "MMM d, yyyy HH:mm")}
                </TableCell>
                <TableCell className="font-medium text-[#004C97]">
                  {entry.travelReqNumber}
                </TableCell>
                <TableCell>
                  <div>
                    <p className="text-sm font-medium">{entry.actor}</p>
                    <p className="text-xs text-gray-500">{entry.actorRole}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{entry.action}</Badge>
                </TableCell>
                <TableCell className="max-w-xs truncate text-sm text-gray-600">
                  {entry.details}
                </TableCell>
                <TableCell className="font-mono text-xs text-gray-400">
                  {entry.ipAddress}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
