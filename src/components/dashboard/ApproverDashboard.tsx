"use client";

import { useMemo, useEffect } from "react";
import { ClipboardCheck, Clock, AlertCircle } from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/shared/StatCard";
import { RequestTable } from "@/components/shared/RequestTable";
import { ActiveFilterPills } from "@/components/shared/ActiveFilterPills";
import { applyAdvancedFilters } from "@/lib/filterRequests";
import type { ColumnKey } from "@/components/shared/RequestTable";

const pendingColumns: { key: ColumnKey; label: string }[] = [
  { key: "travelReqNumber", label: "Travel Req #" },
  { key: "traveler", label: "Traveler" },
  { key: "destination", label: "Destination" },
  { key: "dates", label: "Dates" },
  { key: "submitted", label: "Submitted" },
  { key: "status", label: "Status" },
];

const decisionsColumns: { key: ColumnKey; label: string }[] = [
  { key: "travelReqNumber", label: "Travel Req #" },
  { key: "traveler", label: "Traveler" },
  { key: "destination", label: "Destination" },
  { key: "status", label: "Decision" },
  { key: "updated", label: "Date" },
];

export function ApproverDashboard() {
  const { requests, filters, setShowFiltersButton } = useApp();

  useEffect(() => {
    setShowFiltersButton(true);
    return () => setShowFiltersButton(false);
  }, [setShowFiltersButton]);

  const pendingRequests = useMemo(() => {
    const pending = requests.filter((r) => r.status === "pending_approval");
    return applyAdvancedFilters(pending, filters);
  }, [requests, filters]);

  const recentDecisions = useMemo(() => {
    const decisions = requests.filter(
      (r) =>
        r.status === "approved" ||
        r.status === "returned_by_approver" ||
        r.status === "sent_to_un"
    );
    return applyAdvancedFilters(decisions, filters);
  }, [requests, filters]);

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
        <StatCard
          icon={ClipboardCheck}
          iconColor="text-blue-600"
          iconBg="bg-blue-50"
          label="Pending Review"
          value={pendingRequests.length}
        />
        <StatCard
          icon={Clock}
          iconColor="text-amber-600"
          iconBg="bg-amber-50"
          label="Avg. Review Time"
          value="2.3 days"
        />
        <StatCard
          icon={AlertCircle}
          iconColor="text-red-600"
          iconBg="bg-red-50"
          label="Overdue (>3 days)"
          value={1}
        />
      </div>

      {/* Active filter pills */}
      <ActiveFilterPills />

      {/* Pending Requests */}
      <div className="mb-6">
        <Card className="mb-0 border-b-0 rounded-b-none">
          <CardHeader>
            <CardTitle className="text-lg">
              Pending Approval
              <Badge variant="secondary" className="ml-2">
                {pendingRequests.length}
              </Badge>
            </CardTitle>
          </CardHeader>
        </Card>
        <RequestTable
          requests={pendingRequests}
          columns={pendingColumns}
          emptyMessage="No requests pending approval"
        />
      </div>

      {/* Recent Decisions */}
      <div>
        <Card className="mb-0 border-b-0 rounded-b-none">
          <CardHeader>
            <CardTitle className="text-lg">Recent Decisions</CardTitle>
          </CardHeader>
        </Card>
        <RequestTable
          requests={recentDecisions}
          columns={decisionsColumns}
        />
      </div>
    </div>
  );
}
