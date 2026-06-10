"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Plane,
  Clock,
  MessageSquare,
  Lock,
} from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { TravelerInfoCard } from "@/components/shared/TravelerInfoCard";
import { CountryStayTable } from "@/components/shared/CountryStayTable";
import { AccommodationsTable } from "@/components/shared/AccommodationsTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { TravelRequest } from "@/types";
import { format } from "date-fns";
import { toast } from "sonner";

export function ApproverView({ request }: { request: TravelRequest }) {
  const router = useRouter();
  const { updateRequestStatus, addEmail } = useApp();
  const [approveDialog, setApproveDialog] = useState(false);
  const [rejectDialog, setRejectDialog] = useState(false);
  const [returnDialog, setReturnDialog] = useState(false);
  const [comment, setComment] = useState("");

  const isPending = request.status === "pending_approval";

  const handleApprove = () => {
    updateRequestStatus(
      request.id,
      "approved",
      comment || "Request approved",
      "Michael Chen"
    );
    // Also transition to sent_to_un if applicable
    setTimeout(() => {
      updateRequestStatus(
        request.id,
        "sent_to_un",
        "CSV payload generated and sent to UN Security",
        "System"
      );
    }, 100);

    addEmail({
      id: `email-${Date.now()}`,
      to: request.traveler.email,
      subject: `Travel Request ${request.travelReqNumber} Approved`,
      body: `Your travel request to ${request.primaryDestination} has been approved by Michael Chen and sent to UN Security for clearance.`,
      timestamp: new Date().toISOString(),
      deepLink: `/requests/${request.id}/clearance`,
      read: false,
    });

    toast.success("Request approved and sent to UN Security");
    setApproveDialog(false);
    setComment("");
  };

  const handleReject = () => {
    if (!comment.trim()) {
      toast.error("Please provide a reason for rejection");
      return;
    }
    updateRequestStatus(request.id, "returned_by_approver", comment, "Michael Chen");
    addEmail({
      id: `email-${Date.now()}`,
      to: request.traveler.email,
      subject: `Travel Request ${request.travelReqNumber} Returned for Corrections`,
      body: `Your travel request to ${request.primaryDestination} has been returned by the approver. Comment: "${comment}"`,
      timestamp: new Date().toISOString(),
      deepLink: `/requests/${request.id}`,
      read: false,
    });
    toast.info("Request returned to requestor");
    setRejectDialog(false);
    setReturnDialog(false);
    setComment("");
  };

  return (
    <div className="animate-in fade-in duration-300">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => router.push("/dashboard")}
          className="mb-3 flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to review queue
        </button>

        {/* Approver banner */}
        <div className="mb-4 rounded-lg border border-purple-200 bg-purple-50 p-3">
          <div className="flex items-center gap-2">
            <Lock className="h-4 w-4 text-purple-600" />
            <span className="text-sm font-medium text-purple-800">
              You are reviewing this as Approver — all fields are read-only
            </span>
          </div>
        </div>

        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold text-gray-900">
                {request.travelReqNumber}
              </h1>
              <StatusBadge status={request.status} size="lg" />
            </div>
            <p className="mt-1 text-sm text-gray-500">
              Submitted by {request.traveler.name} ({request.traveler.employeeId})
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          <TravelerInfoCard traveler={request.traveler} locked />

          {/* Itinerary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Plane className="h-5 w-5 text-[#004C97]" />
                Itinerary
                <Badge variant="secondary">{request.itinerary.length} legs</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {request.itinerary.map((leg) => (
                  <div key={leg.id} className="rounded-lg border border-gray-200 bg-gray-50/50 p-4">
                    <div className="mb-3 flex items-center gap-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#004C97] text-xs font-bold text-white">
                        {leg.legNumber}
                      </span>
                      <span className="text-sm font-semibold text-gray-700">
                        {leg.departureCity} → {leg.arrivalCity}
                      </span>
                      <Badge variant="outline" className="text-xs">{leg.modeOfTransport}</Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                      <div>
                        <Label className="text-xs text-gray-500">Departure</Label>
                        <p className="mt-0.5 text-sm">
                          {leg.departureDate ? format(new Date(leg.departureDate), "MMM d") : "—"} {leg.departureTime}
                        </p>
                      </div>
                      <div>
                        <Label className="text-xs text-gray-500">Arrival</Label>
                        <p className="mt-0.5 text-sm">
                          {leg.arrivalDate ? format(new Date(leg.arrivalDate), "MMM d") : "—"} {leg.arrivalTime}
                        </p>
                      </div>
                      <div>
                        <Label className="text-xs text-gray-500">Carrier</Label>
                        <p className="mt-0.5 text-sm">{leg.carrier} {leg.flightNumber}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-gray-500">Transport</Label>
                        <p className="mt-0.5 text-xs text-gray-600">{leg.transportToAirport} / {leg.transportFromAirport}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <AccommodationsTable accommodations={request.accommodations} />

          <CountryStayTable countryStays={request.countryStays} dateFormat="MMM d" />

          {/* Notes */}
          {request.internalNotes && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <MessageSquare className="h-5 w-5 text-[#004C97]" />
                  Requestor Notes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700">{request.internalNotes}</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right column: Actions + History */}
        <div className="space-y-6">
          {/* Action Panel */}
          {isPending && (
            <Card className="border-2 border-[#004C97]">
              <CardHeader>
                <CardTitle className="text-lg">Decision</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Label htmlFor="approver-comment" className="sr-only">Decision comment</Label>
                <Textarea
                  id="approver-comment"
                  placeholder="Add a comment (required for reject/return)..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={3}
                />
                <Button
                  onClick={() => setApproveDialog(true)}
                  className="w-full bg-[#658D1B] hover:bg-[#658D1B]/90"
                >
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Approve
                </Button>
                <Button
                  onClick={() => setReturnDialog(true)}
                  variant="outline"
                  className="w-full border-amber-300 text-amber-700 hover:bg-amber-50"
                >
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Return for Corrections
                </Button>
                <Button
                  onClick={() => setRejectDialog(true)}
                  variant="outline"
                  className="w-full border-red-300 text-red-700 hover:bg-red-50"
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  Reject
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Decision History */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Clock className="h-5 w-5 text-[#004C97]" />
                Decision History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {request.auditTrail
                  .filter((a) => ["Approved", "Returned", "Submitted", "UN Approved", "UN Rejected"].includes(a.action))
                  .reverse()
                  .map((entry) => (
                    <div key={entry.id} className="flex gap-3 border-b border-gray-100 pb-3 last:border-0">
                      <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-gray-300" />
                      <div>
                        <p className="text-sm">
                          <span className="font-medium">{entry.actor}</span>{" "}
                          <span className="text-gray-500">{entry.action.toLowerCase()}</span>
                        </p>
                        <p className="text-xs text-gray-400">
                          {format(new Date(entry.timestamp), "MMM d, h:mm a")}
                        </p>
                        {entry.details && (
                          <p className="mt-0.5 text-xs text-gray-600">{entry.details}</p>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>

          {/* Comments */}
          {request.comments.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Comments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {request.comments.map((c) => (
                    <div key={c.id} className="rounded-lg border border-gray-200 p-3">
                      <div className="mb-1 flex items-center justify-between">
                        <span className="text-sm font-semibold">{c.author}</span>
                        <span className="text-xs text-gray-500">
                          {format(new Date(c.timestamp), "MMM d, h:mm a")}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700">{c.content}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Approve Dialog */}
      <Dialog open={approveDialog} onOpenChange={setApproveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Approval</DialogTitle>
            <DialogDescription>
              Approving this request will generate a CSV payload and send it to
              UN Security for clearance processing. The requestor will be
              notified.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setApproveDialog(false)}>Cancel</Button>
            <Button onClick={handleApprove} className="bg-[#658D1B] hover:bg-[#658D1B]/90">
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Confirm Approval
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject / Return Dialog */}
      <Dialog open={rejectDialog || returnDialog} onOpenChange={() => { setRejectDialog(false); setReturnDialog(false); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {rejectDialog ? "Reject Request" : "Return for Corrections"}
            </DialogTitle>
            <DialogDescription>
              {rejectDialog
                ? "Please provide a reason for rejection. The requestor will be notified."
                : "Please explain what corrections are needed. The requestor will be able to edit and resubmit."}
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="Enter your comments..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => { setRejectDialog(false); setReturnDialog(false); setComment(""); }}>
              Cancel
            </Button>
            <Button
              onClick={handleReject}
              className={rejectDialog ? "bg-red-600 hover:bg-red-700" : "bg-amber-600 hover:bg-amber-700"}
            >
              {rejectDialog ? "Reject" : "Return for Corrections"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
