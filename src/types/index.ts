export type UserRole = "requestor" | "approver" | "administrator";

export type TravelRequestStatus =
  | "draft"
  | "pending_approval"
  | "returned_by_approver"
  | "approved"
  | "sent_to_un"
  | "un_processing"
  | "un_approved"
  | "un_rejected"
  | "returned_by_un";

export interface Traveler {
  id: string;
  employeeId: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  division: string;
  dutyStation: string;
  avatarUrl?: string;
}

export interface ItineraryLeg {
  id: string;
  legNumber: number;
  departureCity: string;
  departureCountry: string;
  arrivalCity: string;
  arrivalCountry: string;
  departureDate: string;
  departureTime: string;
  arrivalDate: string;
  arrivalTime: string;
  modeOfTransport: "flight" | "train" | "car";
  carrier: string;
  flightNumber: string;
  transportToAirport: string;
  transportFromAirport: string;
}

export interface Accommodation {
  id: string;
  legId: string;
  hotelName: string;
  checkInDate: string;
  checkOutDate: string;
  confirmationNumber: string;
  nightlyRate: number;
  currency: string;
}

export interface CountryStay {
  country: string;
  entryDate: string;
  exitDate: string;
  totalNights: number;
  requiresUNClearance: boolean;
}

export interface ValidationIssue {
  id: string;
  field: string;
  severity: "error" | "warning";
  message: string;
}

export interface Comment {
  id: string;
  author: string;
  authorRole: UserRole;
  content: string;
  timestamp: string;
}

export interface AuditEntry {
  id: string;
  timestamp: string;
  actor: string;
  actorRole: UserRole;
  action: string;
  details: string;
  ipAddress: string;
}

export interface SimulatedEmail {
  id: string;
  to: string;
  subject: string;
  body: string;
  timestamp: string;
  deepLink: string;
  read: boolean;
}

export interface TravelRequest {
  id: string;
  travelReqNumber: string;
  status: TravelRequestStatus;
  traveler: Traveler;
  itinerary: ItineraryLeg[];
  accommodations: Accommodation[];
  countryStays: CountryStay[];
  comments: Comment[];
  auditTrail: AuditEntry[];
  validationIssues: ValidationIssue[];
  internalNotes: string;
  primaryDestination: string;
  startDate: string;
  endDate: string;
  approver: string;
  createdAt: string;
  updatedAt: string;
  unReferenceNumber?: string;
  unOfficerName?: string;
  unResponseTimestamp?: string;
  unComments?: string;
}

export interface WorkflowConfig {
  resubmitDirectlyToUN: boolean;
  allowReworkOnRejection: boolean;
}

export const STATUS_LABELS: Record<TravelRequestStatus, string> = {
  draft: "Draft",
  pending_approval: "Pending Approval",
  returned_by_approver: "Returned by Approver",
  approved: "Approved",
  sent_to_un: "Sent to UN Security",
  un_processing: "UN Processing",
  un_approved: "UN Approved",
  un_rejected: "UN Rejected",
  returned_by_un: "Returned for Corrections",
};

export const STATUS_COLORS: Record<TravelRequestStatus, { bg: string; text: string; border: string }> = {
  draft: { bg: "bg-[#B1B3B3]/15", text: "text-[#707372]", border: "border-[#B1B3B3]" },
  pending_approval: { bg: "bg-[#009CDE]/10", text: "text-[#004C97]", border: "border-[#009CDE]" },
  returned_by_approver: { bg: "bg-[#F2A900]/10", text: "text-[#6E6259]", border: "border-[#F2A900]" },
  approved: { bg: "bg-[#78BE20]/10", text: "text-[#658D1B]", border: "border-[#78BE20]" },
  sent_to_un: { bg: "bg-[#004C97]/10", text: "text-[#004C97]", border: "border-[#004C97]" },
  un_processing: { bg: "bg-[#8031A7]/10", text: "text-[#8031A7]", border: "border-[#8031A7]" },
  un_approved: { bg: "bg-[#78BE20]/15", text: "text-[#658D1B]", border: "border-[#658D1B]" },
  un_rejected: { bg: "bg-[#DA291C]/10", text: "text-[#DA291C]", border: "border-[#DA291C]" },
  returned_by_un: { bg: "bg-[#FF8200]/10", text: "text-[#E35205]", border: "border-[#FF8200]" },
};
