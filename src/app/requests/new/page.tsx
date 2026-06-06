"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useApp } from "@/contexts/AppContext";

export default function NewRequestPage() {
  const router = useRouter();
  const { createNewRequest } = useApp();

  useEffect(() => {
    const newReq = createNewRequest();
    router.replace(`/requests/${newReq.id}`);
  }, [createNewRequest, router]);

  return (
    <div className="flex items-center justify-center py-20">
      <div className="flex items-center gap-2 text-gray-500">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#002855] border-t-transparent" />
        Creating new travel request...
      </div>
    </div>
  );
}
