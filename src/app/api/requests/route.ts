import { NextResponse } from "next/server";
import { travelRequests } from "@/data/seed";

export async function GET() {
  // Simulate Fabric data source latency
  await new Promise((resolve) => setTimeout(resolve, 400));

  return NextResponse.json({
    source: "Microsoft Fabric Data Table",
    timestamp: new Date().toISOString(),
    data: travelRequests,
  });
}
