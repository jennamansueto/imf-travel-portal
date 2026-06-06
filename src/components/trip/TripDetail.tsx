"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Save,
  CheckCircle2,
  Send,
  Clock,
  User,
  Plane,
  Hotel,
  Globe,
  AlertTriangle,
  AlertCircle,
  MessageSquare,
  Plus,
  Trash2,
  Lock,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { TravelRequest, TravelRequestStatus, ItineraryLeg, Accommodation } from "@/types";
import { format } from "date-fns";
import { toast } from "sonner";

const EDITABLE_STATUSES: TravelRequestStatus[] = [
  "draft",
  "returned_by_approver",
  "returned_by_un",
];

export function TripDetail({ request }: { request: TravelRequest }) {
  const router = useRouter();
  const { updateRequestStatus, updateRequest, addEmail } = useApp();
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [validationOpen, setValidationOpen] = useState(true);
  const [notes, setNotes] = useState(request.internalNotes);

  const isEditable = EDITABLE_STATUSES.includes(request.status);
  const hasErrors = request.validationIssues.some(
    (v) => v.severity === "error"
  );

  const returnedComment = useMemo(() => {
    if (
      request.status === "returned_by_approver" ||
      request.status === "returned_by_un"
    ) {
      return request.comments[request.comments.length - 1];
    }
    return null;
  }, [request]);

  const handleSaveDraft = () => {
    updateRequest(request.id, { internalNotes: notes });
    toast.success("Draft saved successfully");
  };

  const handleSubmit = () => {
    if (hasErrors) {
      toast.error("Please resolve all validation errors before submitting");
      return;
    }
    setShowSubmitDialog(true);
  };

  const confirmSubmit = () => {
    updateRequestStatus(
      request.id,
      "pending_approval",
      "Submitted for approval",
      request.traveler.name
    );
    addEmail({
      id: `email-${Date.now()}`,
      to: request.traveler.email,
      subject: `Travel Request ${request.travelReqNumber} Submitted for Approval`,
      body: `Your travel request to ${request.primaryDestination} has been submitted and is awaiting approval from ${request.approver}.`,
      timestamp: new Date().toISOString(),
      deepLink: `/requests/${request.id}`,
      read: false,
    });
    toast.success("Request submitted for approval");
    setShowSubmitDialog(false);
  };

  const addLeg = () => {
    const newLeg: ItineraryLeg = {
      id: `leg-${Date.now()}`,
      legNumber: request.itinerary.length + 1,
      departureCity: "",
      departureCountry: "",
      arrivalCity: "",
      arrivalCountry: "",
      departureDate: "",
      departureTime: "",
      arrivalDate: "",
      arrivalTime: "",
      modeOfTransport: "flight",
      carrier: "",
      flightNumber: "",
      transportToAirport: "",
      transportFromAirport: "",
    };
    updateRequest(request.id, {
      itinerary: [...request.itinerary, newLeg],
    });
  };

  const removeLeg = (legId: string) => {
    updateRequest(request.id, {
      itinerary: request.itinerary.filter((l) => l.id !== legId),
    });
  };

  const addAccommodation = () => {
    const newAcc: Accommodation = {
      id: `acc-${Date.now()}`,
      legId: request.itinerary[0]?.id || "",
      hotelName: "",
      checkInDate: "",
      checkOutDate: "",
      confirmationNumber: "",
      nightlyRate: 0,
      currency: "USD",
    };
    updateRequest(request.id, {
      accommodations: [...request.accommodations, newAcc],
    });
  };

  return (
    <div className="animate-in fade-in duration-300">
      {/* Back button & Header */}
      <div className="mb-6">
        <button
          onClick={() => router.push("/dashboard")}
          className="mb-3 flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to dashboard
        </button>

        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold text-gray-900">
                {request.travelReqNumber}
              </h1>
              <StatusBadge status={request.status} size="lg" />
            </div>
            <p className="mt-1 text-sm text-gray-500">
              Last saved:{" "}
              {format(new Date(request.updatedAt), "MMM d, yyyy 'at' h:mm a")}
            </p>
          </div>
          {isEditable && (
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={handleSaveDraft}>
                <Save className="mr-2 h-4 w-4" />
                Save Draft
              </Button>
              <Button
                onClick={handleSubmit}
                className="bg-[#002855] hover:bg-[#001a3a]"
                disabled={hasErrors}
              >
                <Send className="mr-2 h-4 w-4" />
                Submit to Approver
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Returned status banner */}
      {returnedComment && (
        <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 text-amber-600" />
            <div>
              <p className="font-semibold text-amber-800">
                {request.status === "returned_by_approver"
                  ? "Returned by Approver"
                  : "Returned by UN for Corrections"}
              </p>
              <p className="mt-1 text-sm text-amber-700">
                {returnedComment.content}
              </p>
              <p className="mt-1 text-xs text-amber-600">
                {returnedComment.author} —{" "}
                {format(
                  new Date(returnedComment.timestamp),
                  "MMM d, yyyy 'at' h:mm a"
                )}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* UN Comments banner for returned_by_un */}
      {request.status === "returned_by_un" && request.unComments && (
        <div className="mb-6 rounded-lg border border-orange-200 bg-orange-50 p-4">
          <div className="flex items-start gap-3">
            <Globe className="mt-0.5 h-5 w-5 text-orange-600" />
            <div>
              <p className="font-semibold text-orange-800">
                UN DSS Comments
              </p>
              <p className="mt-1 text-sm text-orange-700">
                {request.unComments}
              </p>
              {request.unReferenceNumber && (
                <p className="mt-1 text-xs text-orange-600">
                  Reference: {request.unReferenceNumber}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          {/* Traveler Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <User className="h-5 w-5 text-[#002855]" />
                Traveler Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                <div>
                  <Label className="text-xs text-gray-500">Employee Name</Label>
                  <p className="mt-0.5 text-sm font-medium">{request.traveler.name}</p>
                </div>
                <div>
                  <Label className="text-xs text-gray-500">Employee ID</Label>
                  <p className="mt-0.5 text-sm font-medium">{request.traveler.employeeId}</p>
                </div>
                <div>
                  <Label className="text-xs text-gray-500">Department</Label>
                  <p className="mt-0.5 text-sm font-medium">{request.traveler.department}</p>
                </div>
                <div>
                  <Label className="text-xs text-gray-500">Division</Label>
                  <p className="mt-0.5 text-sm font-medium">{request.traveler.division}</p>
                </div>
                <div>
                  <Label className="text-xs text-gray-500">Duty Station</Label>
                  <p className="mt-0.5 text-sm font-medium">{request.traveler.dutyStation}</p>
                </div>
                <div>
                  <Label className="text-xs text-gray-500">Email</Label>
                  <p className="mt-0.5 text-sm font-medium">{request.traveler.email}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Itinerary Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-lg">
                  <Plane className="h-5 w-5 text-[#002855]" />
                  Itinerary
                  <Badge variant="secondary">{request.itinerary.length} legs</Badge>
                </span>
                {isEditable && (
                  <Button variant="outline" size="sm" onClick={addLeg}>
                    <Plus className="mr-1.5 h-3.5 w-3.5" />
                    Add Leg
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {request.itinerary.length === 0 ? (
                <div className="flex flex-col items-center py-8 text-gray-400">
                  <Plane className="mb-2 h-8 w-8" />
                  <p>No itinerary legs added</p>
                  {isEditable && (
                    <Button variant="link" onClick={addLeg} className="mt-2">
                      Add your first leg
                    </Button>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {request.itinerary.map((leg) => (
                    <div
                      key={leg.id}
                      className="rounded-lg border border-gray-200 p-4"
                    >
                      <div className="mb-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#002855] text-xs font-bold text-white">
                            {leg.legNumber}
                          </span>
                          <span className="text-sm font-semibold text-gray-700">
                            Leg {leg.legNumber}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {leg.modeOfTransport}
                          </Badge>
                        </div>
                        {isEditable && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeLeg(leg.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                        <div>
                          <Label className="text-xs text-gray-500">From</Label>
                          {isEditable ? (
                            <Input
                              defaultValue={`${leg.departureCity}, ${leg.departureCountry}`}
                              className="mt-1 text-sm"
                            />
                          ) : (
                            <p className="mt-0.5 flex items-center gap-1 text-sm">
                              {!isEditable && <Lock className="h-3 w-3 text-gray-300" />}
                              {leg.departureCity}, {leg.departureCountry}
                            </p>
                          )}
                        </div>
                        <div>
                          <Label className="text-xs text-gray-500">To</Label>
                          {isEditable ? (
                            <Input
                              defaultValue={`${leg.arrivalCity}, ${leg.arrivalCountry}`}
                              className="mt-1 text-sm"
                            />
                          ) : (
                            <p className="mt-0.5 text-sm">
                              {leg.arrivalCity}, {leg.arrivalCountry}
                            </p>
                          )}
                        </div>
                        <div>
                          <Label className="text-xs text-gray-500">Departure</Label>
                          <p className="mt-0.5 text-sm">
                            {leg.departureDate ? format(new Date(leg.departureDate), "MMM d") : "—"}{" "}
                            {leg.departureTime}
                          </p>
                        </div>
                        <div>
                          <Label className="text-xs text-gray-500">Arrival</Label>
                          <p className="mt-0.5 text-sm">
                            {leg.arrivalDate ? format(new Date(leg.arrivalDate), "MMM d") : "—"}{" "}
                            {leg.arrivalTime}
                          </p>
                        </div>
                        <div>
                          <Label className="text-xs text-gray-500">Carrier</Label>
                          <p className="mt-0.5 text-sm">{leg.carrier || "—"}</p>
                        </div>
                        <div>
                          <Label className="text-xs text-gray-500">Flight/Train #</Label>
                          <p className="mt-0.5 text-sm">{leg.flightNumber || "—"}</p>
                        </div>
                        <div>
                          <Label className="text-xs text-gray-500">To Airport</Label>
                          <p className="mt-0.5 text-sm">{leg.transportToAirport || "—"}</p>
                        </div>
                        <div>
                          <Label className="text-xs text-gray-500">From Airport</Label>
                          <p className="mt-0.5 text-sm">{leg.transportFromAirport || "—"}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Accommodation Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-lg">
                  <Hotel className="h-5 w-5 text-[#002855]" />
                  Accommodations
                </span>
                {isEditable && (
                  <Button variant="outline" size="sm" onClick={addAccommodation}>
                    <Plus className="mr-1.5 h-3.5 w-3.5" />
                    Add Hotel
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {request.accommodations.length === 0 ? (
                <div className="flex flex-col items-center py-8 text-gray-400">
                  <Hotel className="mb-2 h-8 w-8" />
                  <p>No accommodations added</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50">
                      <TableHead>Hotel</TableHead>
                      <TableHead>Check-in</TableHead>
                      <TableHead>Check-out</TableHead>
                      <TableHead>Confirmation #</TableHead>
                      <TableHead>Rate</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {request.accommodations.map((acc) => (
                      <TableRow key={acc.id}>
                        <TableCell className="font-medium">{acc.hotelName}</TableCell>
                        <TableCell>
                          {acc.checkInDate
                            ? format(new Date(acc.checkInDate), "MMM d, yyyy")
                            : "—"}
                        </TableCell>
                        <TableCell>
                          {acc.checkOutDate
                            ? format(new Date(acc.checkOutDate), "MMM d, yyyy")
                            : "—"}
                        </TableCell>
                        <TableCell className="font-mono text-xs">
                          {acc.confirmationNumber || "—"}
                        </TableCell>
                        <TableCell>
                          {acc.nightlyRate > 0
                            ? `$${acc.nightlyRate} ${acc.currency}/night`
                            : "—"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          {/* Country Stay Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Globe className="h-5 w-5 text-[#002855]" />
                Country Stay Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              {request.countryStays.length === 0 ? (
                <p className="py-4 text-center text-sm text-gray-400">
                  Country stays auto-calculated from itinerary
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50">
                      <TableHead>Country</TableHead>
                      <TableHead>Entry</TableHead>
                      <TableHead>Exit</TableHead>
                      <TableHead>Nights</TableHead>
                      <TableHead>UN Clearance</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {request.countryStays.map((cs) => (
                      <TableRow key={cs.country}>
                        <TableCell className="font-medium">{cs.country}</TableCell>
                        <TableCell>
                          {format(new Date(cs.entryDate), "MMM d, yyyy")}
                        </TableCell>
                        <TableCell>
                          {format(new Date(cs.exitDate), "MMM d, yyyy")}
                        </TableCell>
                        <TableCell>{cs.totalNights}</TableCell>
                        <TableCell>
                          {cs.requiresUNClearance ? (
                            <Badge className="bg-amber-100 text-amber-800 border-amber-300">
                              Required
                            </Badge>
                          ) : (
                            <Badge variant="secondary">Not Required</Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          {/* Notes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <MessageSquare className="h-5 w-5 text-[#002855]" />
                Internal Notes
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isEditable ? (
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add trip justification, meeting details, or other notes..."
                  rows={4}
                />
              ) : (
                <p className="text-sm text-gray-700">
                  {request.internalNotes || "No notes added"}
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right sidebar */}
        <div className="space-y-6">
          {/* Validation Panel */}
          <Card>
            <CardHeader>
              <button
                onClick={() => setValidationOpen(!validationOpen)}
                className="flex w-full items-center justify-between"
              >
                <CardTitle className="flex items-center gap-2 text-lg">
                  {hasErrors ? (
                    <AlertCircle className="h-5 w-5 text-red-500" />
                  ) : (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  )}
                  Validation
                  {request.validationIssues.length > 0 && (
                    <Badge
                      variant="secondary"
                      className={
                        hasErrors
                          ? "bg-red-100 text-red-700"
                          : "bg-amber-100 text-amber-700"
                      }
                    >
                      {request.validationIssues.length}
                    </Badge>
                  )}
                </CardTitle>
                {validationOpen ? (
                  <ChevronUp className="h-4 w-4 text-gray-400" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                )}
              </button>
            </CardHeader>
            {validationOpen && (
              <CardContent>
                {request.validationIssues.length === 0 ? (
                  <div className="flex items-center gap-2 rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">
                    <CheckCircle2 className="h-4 w-4" />
                    All validations passed
                  </div>
                ) : (
                  <div className="space-y-2">
                    {request.validationIssues.map((issue) => (
                      <div
                        key={issue.id}
                        className={`rounded-lg border px-3 py-2 text-sm ${
                          issue.severity === "error"
                            ? "border-red-200 bg-red-50 text-red-700"
                            : "border-amber-200 bg-amber-50 text-amber-700"
                        }`}
                      >
                        <div className="flex items-center gap-1.5">
                          {issue.severity === "error" ? (
                            <AlertCircle className="h-3.5 w-3.5" />
                          ) : (
                            <AlertTriangle className="h-3.5 w-3.5" />
                          )}
                          <span className="font-medium">
                            {issue.severity === "error" ? "Error" : "Warning"}
                          </span>
                        </div>
                        <p className="mt-1">{issue.message}</p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            )}
          </Card>

          {/* Comments */}
          {request.comments.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <MessageSquare className="h-5 w-5 text-[#002855]" />
                  Comments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {request.comments.map((comment) => (
                    <div
                      key={comment.id}
                      className="rounded-lg border border-gray-200 p-3"
                    >
                      <div className="mb-1 flex items-center justify-between">
                        <span className="text-sm font-semibold text-gray-900">
                          {comment.author}
                        </span>
                        <span className="text-xs text-gray-500">
                          {format(
                            new Date(comment.timestamp),
                            "MMM d, h:mm a"
                          )}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700">{comment.content}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Audit Trail (compact) */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Clock className="h-5 w-5 text-[#002855]" />
                Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {request.auditTrail.slice(-5).reverse().map((entry) => (
                  <div key={entry.id} className="flex gap-3">
                    <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-gray-300" />
                    <div>
                      <p className="text-sm text-gray-900">
                        <span className="font-medium">{entry.actor}</span>{" "}
                        <span className="text-gray-500">{entry.action.toLowerCase()}</span>
                      </p>
                      <p className="text-xs text-gray-500">
                        {format(new Date(entry.timestamp), "MMM d, h:mm a")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Submit confirmation dialog */}
      <Dialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Submit for Approval</DialogTitle>
            <DialogDescription>
              This will send your travel request {request.travelReqNumber} to{" "}
              {request.approver} for review. You will not be able to edit the
              request while it is pending approval.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowSubmitDialog(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={confirmSubmit}
              className="bg-[#002855] hover:bg-[#001a3a]"
            >
              <Send className="mr-2 h-4 w-4" />
              Submit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
