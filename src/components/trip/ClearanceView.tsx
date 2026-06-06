"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Shield,
  CheckCircle2,
  XCircle,
  Clock,
  Send,
  FileText,
  Download,
  RotateCcw,
  PartyPopper,
} from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import type { TravelRequest, TravelRequestStatus } from "@/types";
import { format } from "date-fns";
import { toast } from "sonner";

const stepperStates: { status: TravelRequestStatus; label: string; icon: React.ElementType }[] = [
  { status: "draft", label: "Draft", icon: FileText },
  { status: "pending_approval", label: "Submitted", icon: Send },
  { status: "approved", label: "Approved", icon: CheckCircle2 },
  { status: "sent_to_un", label: "Sent to UN", icon: Shield },
  { status: "un_processing", label: "UN Processing", icon: Clock },
  { status: "un_approved", label: "UN Decision", icon: CheckCircle2 },
];

function getStepIndex(status: TravelRequestStatus): number {
  const map: Record<TravelRequestStatus, number> = {
    draft: 0,
    pending_approval: 1,
    returned_by_approver: 1,
    approved: 2,
    sent_to_un: 3,
    un_processing: 4,
    un_approved: 5,
    un_rejected: 5,
    returned_by_un: 5,
  };
  return map[status];
}

export function ClearanceView({ request }: { request: TravelRequest }) {
  const router = useRouter();
  const { simulateUNResponse } = useApp();
  const [payloadFormat, setPayloadFormat] = useState<"csv" | "json">("csv");

  const currentStep = getStepIndex(request.status);
  const canSimulate = ["sent_to_un", "un_processing"].includes(request.status);

  const handleSimulate = (response: "approved" | "rejected" | "returned") => {
    simulateUNResponse(request.id, response);
    toast.success(`UN response simulated: ${response}`);
  };

  const csvPayload = request.itinerary
    .map(
      (leg) =>
        `${request.travelReqNumber},${request.traveler.name},${request.traveler.employeeId},${leg.departureCity},${leg.arrivalCity},${leg.departureDate},${leg.arrivalDate}`
    )
    .join("\n");

  const jsonPayload = JSON.stringify(
    {
      travelReqNumber: request.travelReqNumber,
      traveler: {
        name: request.traveler.name,
        employeeId: request.traveler.employeeId,
        department: request.traveler.department,
      },
      itinerary: request.itinerary.map((leg) => ({
        from: `${leg.departureCity}, ${leg.departureCountry}`,
        to: `${leg.arrivalCity}, ${leg.arrivalCountry}`,
        departure: `${leg.departureDate} ${leg.departureTime}`,
        arrival: `${leg.arrivalDate} ${leg.arrivalTime}`,
        carrier: `${leg.carrier} ${leg.flightNumber}`,
      })),
      countryStays: request.countryStays,
    },
    null,
    2
  );

  const handleDownloadCSV = () => {
    window.open(`/api/export?id=${request.id}`, "_blank");
  };

  return (
    <div className="animate-in fade-in duration-300">
      <button
        onClick={() => router.push(`/requests/${request.id}`)}
        className="mb-3 flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to request
      </button>

      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            UN Security Clearance — {request.travelReqNumber}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {request.traveler.name} · {request.primaryDestination}
          </p>
        </div>
        <StatusBadge status={request.status} size="lg" />
      </div>

      {/* Success banner for approved */}
      {request.status === "un_approved" && (
        <div className="mb-6 rounded-lg border-2 border-emerald-300 bg-gradient-to-r from-emerald-50 to-green-50 p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
              <PartyPopper className="h-6 w-6 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-emerald-800">
                Trip Approved
              </h2>
              <p className="text-sm text-emerald-600">
                UN security clearance has been granted. All travel arrangements
                are confirmed.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Rejection banner */}
      {request.status === "un_rejected" && (
        <div className="mb-6 rounded-lg border-2 border-red-300 bg-red-50 p-6">
          <div className="flex items-center gap-3">
            <XCircle className="h-8 w-8 text-red-500" />
            <div>
              <h2 className="text-xl font-semibold text-red-800">
                Security Clearance Denied
              </h2>
              <p className="text-sm text-red-600">
                Travel to this destination has been denied by UN DSS.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Returned banner */}
      {request.status === "returned_by_un" && (
        <div className="mb-6 rounded-lg border-2 border-orange-300 bg-orange-50 p-6">
          <div className="flex items-center gap-3">
            <RotateCcw className="h-8 w-8 text-orange-500" />
            <div>
              <h2 className="text-xl font-semibold text-orange-800">
                Returned for Corrections
              </h2>
              <p className="text-sm text-orange-600">
                Additional information is required before clearance can be processed.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Status Stepper */}
      <Card className="mb-6">
        <CardContent className="py-6">
          <div className="flex items-center justify-between">
            {stepperStates.map((step, idx) => {
              const Icon = step.icon;
              const isComplete = idx < currentStep;
              const isCurrent = idx === currentStep;
              const isFailed =
                idx === 5 &&
                (request.status === "un_rejected" ||
                  request.status === "returned_by_un");

              return (
                <div key={step.status} className="flex flex-1 items-center">
                  <div className="flex flex-col items-center">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors ${
                        isFailed
                          ? "border-red-500 bg-red-50"
                          : isComplete
                            ? "border-green-500 bg-green-50"
                            : isCurrent
                              ? "border-[#0073CF] bg-blue-50"
                              : "border-gray-300 bg-gray-50"
                      }`}
                    >
                      {isComplete ? (
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                      ) : isFailed ? (
                        <XCircle className="h-5 w-5 text-red-500" />
                      ) : (
                        <Icon
                          className={`h-5 w-5 ${
                            isCurrent
                              ? "text-[#0073CF]"
                              : "text-gray-400"
                          }`}
                        />
                      )}
                    </div>
                    <span
                      className={`mt-2 text-xs font-medium ${
                        isCurrent
                          ? "text-[#0073CF]"
                          : isComplete
                            ? "text-green-600"
                            : isFailed
                              ? "text-red-600"
                              : "text-gray-400"
                      }`}
                    >
                      {idx === 5 && request.status === "un_rejected"
                        ? "Rejected"
                        : idx === 5 && request.status === "returned_by_un"
                          ? "Returned"
                          : step.label}
                    </span>
                  </div>
                  {idx < stepperStates.length - 1 && (
                    <div
                      className={`mx-2 h-0.5 flex-1 ${
                        idx < currentStep ? "bg-green-400" : "bg-gray-200"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Payload Preview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-lg">
                <FileText className="h-5 w-5 text-[#002855]" />
                UN Payload Preview
              </span>
              <div className="flex gap-2">
                <Button
                  variant={payloadFormat === "csv" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPayloadFormat("csv")}
                  className={payloadFormat === "csv" ? "bg-[#002855]" : ""}
                >
                  CSV
                </Button>
                <Button
                  variant={payloadFormat === "json" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPayloadFormat("json")}
                  className={payloadFormat === "json" ? "bg-[#002855]" : ""}
                >
                  JSON
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="max-h-64 overflow-auto rounded-lg bg-slate-900 p-4 text-xs text-green-400">
              {payloadFormat === "csv" ? csvPayload : jsonPayload}
            </pre>
            <div className="mt-3 flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownloadCSV}
              >
                <Download className="mr-1.5 h-3.5 w-3.5" />
                Download CSV
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* UN Response Panel */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Shield className="h-5 w-5 text-[#002855]" />
              UN Response
            </CardTitle>
          </CardHeader>
          <CardContent>
            {request.unReferenceNumber ? (
              <div className="space-y-3">
                <div>
                  <Label className="text-xs text-gray-500">Status</Label>
                  <div className="mt-1">
                    <StatusBadge status={request.status} size="lg" />
                  </div>
                </div>
                <div>
                  <Label className="text-xs text-gray-500">UN Reference</Label>
                  <p className="mt-0.5 font-mono text-sm">
                    {request.unReferenceNumber}
                  </p>
                </div>
                <div>
                  <Label className="text-xs text-gray-500">Officer</Label>
                  <p className="mt-0.5 text-sm">{request.unOfficerName}</p>
                </div>
                <div>
                  <Label className="text-xs text-gray-500">Response Date</Label>
                  <p className="mt-0.5 text-sm">
                    {request.unResponseTimestamp
                      ? format(
                          new Date(request.unResponseTimestamp),
                          "MMM d, yyyy 'at' h:mm a"
                        )
                      : "—"}
                  </p>
                </div>
                {request.unComments && (
                  <div>
                    <Label className="text-xs text-gray-500">Comments</Label>
                    <p className="mt-0.5 text-sm text-gray-700 rounded-lg bg-gray-50 p-3">
                      {request.unComments}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center py-8 text-gray-400">
                <Clock className="mb-2 h-8 w-8 animate-pulse" />
                <p className="font-medium">Awaiting UN Response</p>
                <p className="mt-1 text-xs">
                  Processing time: typically 3-5 business days
                </p>
              </div>
            )}

            {/* Simulation controls */}
            {canSimulate && (
              <div className="mt-6 rounded-lg border-2 border-dashed border-gray-300 p-4">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Demo: Simulate UN Response
                </p>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleSimulate("approved")}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" />
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleSimulate("returned")}
                    className="border-amber-300 text-amber-700"
                  >
                    <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
                    Return
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleSimulate("rejected")}
                    className="border-red-300 text-red-700"
                  >
                    <XCircle className="mr-1.5 h-3.5 w-3.5" />
                    Reject
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Audit Trail */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg">Full Audit Trail</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {request.auditTrail.map((entry) => (
              <div
                key={entry.id}
                className="flex items-start gap-3 border-b border-gray-100 pb-3 last:border-0"
              >
                <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#002855]" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm">
                      <span className="font-medium">{entry.actor}</span>{" "}
                      <span className="text-gray-500">
                        — {entry.action}
                      </span>
                    </p>
                    <span className="text-xs text-gray-400">
                      {format(new Date(entry.timestamp), "MMM d, h:mm a")}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-gray-600">
                    {entry.details}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
