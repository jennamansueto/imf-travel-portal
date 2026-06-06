"use client";

import { use } from "react";
import { useApp } from "@/contexts/AppContext";
import { ClearanceView } from "@/components/trip/ClearanceView";
import { notFound } from "next/navigation";

export default function ClearancePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { requests } = useApp();
  const request = requests.find((r) => r.id === id);

  if (!request) return notFound();
  return <ClearanceView request={request} />;
}
