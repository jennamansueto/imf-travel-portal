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

export type SortOption =
  | "updated_newest"
  | "updated_oldest"
  | "travel_soonest"
  | "travel_latest"
  | "req_asc"
  | "req_desc";

export const SORT_LABELS: Record<SortOption, string> = {
  updated_newest: "Last Updated (newest)",
  updated_oldest: "Last Updated (oldest)",
  travel_soonest: "Travel Date (soonest)",
  travel_latest: "Travel Date (latest)",
  req_asc: "Requisition # (ascending)",
  req_desc: "Requisition # (descending)",
};

export interface AdvancedFilters {
  statuses: TravelRequestStatus[];
  destination: string;
  dateFrom: string;
  dateTo: string;
  approver: string;
  sortBy: SortOption;
}

export const EMPTY_FILTERS: AdvancedFilters = {
  statuses: [],
  destination: "",
  dateFrom: "",
  dateTo: "",
  approver: "",
  sortBy: "updated_newest",
};

export const STATUS_COLORS: Record<TravelRequestStatus, { bg: string; text: string; border: string }> = {
  draft: { bg: "bg-slate-100", text: "text-slate-700", border: "border-slate-300" },
  pending_approval: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-300" },
  returned_by_approver: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-300" },
  approved: { bg: "bg-green-50", text: "text-green-700", border: "border-green-300" },
  sent_to_un: { bg: "bg-indigo-50", text: "text-indigo-700", border: "border-indigo-300" },
  un_processing: { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-300" },
  un_approved: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-300" },
  un_rejected: { bg: "bg-red-50", text: "text-red-700", border: "border-red-300" },
  returned_by_un: { bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-300" },
};
