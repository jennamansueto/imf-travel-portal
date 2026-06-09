import { NextResponse } from "next/server";
import { travelRequests } from "@/data/seed";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const requestId = searchParams.get("id");

  const travelReq = travelRequests.find((r) => r.id === requestId);
  if (!travelReq) {
    return NextResponse.json({ error: "Request not found" }, { status: 404 });
  }

  const headers = [
    "Travel Requisition Number",
    "Traveler Name",
    "Employee ID",
    "Department",
    "Division",
    "Duty Station",
    "Primary Destination",
    "Start Date",
    "End Date",
    "Status",
    "Leg Number",
    "Departure City",
    "Departure Country",
    "Arrival City",
    "Arrival Country",
    "Departure Date",
    "Departure Time",
    "Arrival Date",
    "Arrival Time",
    "Mode of Transport",
    "Carrier",
    "Flight Number",
    "Hotel Name",
    "Check-in Date",
    "Check-out Date",
    "Nightly Rate",
    "Currency",
    "Country",
    "Total Nights",
    "UN Clearance Required",
  ];

  const rows = travelReq.itinerary.map((leg) => {
    const accommodation = travelReq.accommodations.find(
      (a) => a.legId === leg.id
    );
    const countryStay = travelReq.countryStays.find(
      (c) => c.country === leg.arrivalCountry
    );

    return [
      travelReq.travelReqNumber,
      travelReq.traveler.name,
      travelReq.traveler.employeeId,
      travelReq.traveler.department,
      travelReq.traveler.division,
      travelReq.traveler.dutyStation,
      travelReq.primaryDestination,
      travelReq.startDate,
      travelReq.endDate,
      travelReq.status,
      String(leg.legNumber),
      leg.departureCity,
      leg.departureCountry,
      leg.arrivalCity,
      leg.arrivalCountry,
      leg.departureDate,
      leg.departureTime,
      leg.arrivalDate,
      leg.arrivalTime,
      leg.modeOfTransport,
      leg.carrier,
      leg.flightNumber,
      accommodation?.hotelName || "",
      accommodation?.checkInDate || "",
      accommodation?.checkOutDate || "",
      accommodation ? String(accommodation.nightlyRate) : "",
      accommodation?.currency || "",
      countryStay?.country || "",
      countryStay ? String(countryStay.totalNights) : "",
      countryStay ? (countryStay.requiresUNClearance ? "Yes" : "No") : "",
    ]
      .map((v) => `"${v.replace(/"/g, '""')}"`)
      .join(",");
  });

  const csv = [headers.map((h) => `"${h}"`).join(","), ...rows].join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="${travelReq.travelReqNumber}-un-payload.csv"`,
    },
  });
}
