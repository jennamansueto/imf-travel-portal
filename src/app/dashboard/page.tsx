"use client";

import { useApp } from "@/contexts/AppContext";
import { RequestorDashboard } from "@/components/dashboard/RequestorDashboard";
import { ApproverDashboard } from "@/components/dashboard/ApproverDashboard";
import { AdminDashboard } from "@/components/dashboard/AdminDashboard";

export default function DashboardPage() {
  const { role } = useApp();

  if (role === "approver") return <ApproverDashboard />;
  if (role === "administrator") return <AdminDashboard />;
  return <RequestorDashboard />;
}
