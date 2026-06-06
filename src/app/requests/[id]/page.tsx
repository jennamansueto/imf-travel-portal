"use client";

import { use } from "react";
import { useApp } from "@/contexts/AppContext";
import { TripDetail } from "@/components/trip/TripDetail";
import { ApproverView } from "@/components/approver/ApproverView";
import { notFound } from "next/navigation";

export default function RequestPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { requests, role } = useApp();
  const request = requests.find((r) => r.id === id);

  if (!request) {
    return notFound();
  }

  if (role === "approver") {
    return <ApproverView request={request} />;
  }

  return <TripDetail request={request} />;
}
