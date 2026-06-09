import type { TravelRequest, Traveler, SimulatedEmail, WorkflowConfig, ItineraryLeg, Accommodation, CountryStay, AuditEntry, ValidationIssue, Comment } from "@/types";

// Factory helpers to reduce structural repetition
function leg(id: string, legNumber: number, from: [string, string], to: [string, string], dep: [string, string], arr: [string, string], transport: "flight" | "train" | "car", carrier: string, flight: string, toAirport: string, fromAirport: string): ItineraryLeg {
  return { id, legNumber, departureCity: from[0], departureCountry: from[1], arrivalCity: to[0], arrivalCountry: to[1], departureDate: dep[0], departureTime: dep[1], arrivalDate: arr[0], arrivalTime: arr[1], modeOfTransport: transport, carrier, flightNumber: flight, transportToAirport: toAirport, transportFromAirport: fromAirport };
}

function acc(id: string, legId: string, hotelName: string, checkIn: string, checkOut: string, confirmation: string, rate: number, currency = "USD"): Accommodation {
  return { id, legId, hotelName, checkInDate: checkIn, checkOutDate: checkOut, confirmationNumber: confirmation, nightlyRate: rate, currency };
}

function stay(country: string, entry: string, exit: string, nights: number, un: boolean): CountryStay {
  return { country, entryDate: entry, exitDate: exit, totalNights: nights, requiresUNClearance: un };
}

function audit(id: string, timestamp: string, actor: string, actorRole: string, action: string, details: string, ip: string): AuditEntry {
  return { id, timestamp, actor, actorRole: actorRole as AuditEntry["actorRole"], action, details, ipAddress: ip };
}

function validation(id: string, field: string, severity: "error" | "warning", message: string): ValidationIssue {
  return { id, field, severity, message };
}

function comment(id: string, author: string, authorRole: string, content: string, timestamp: string): Comment {
  return { id, author, authorRole: authorRole as Comment["authorRole"], content, timestamp };
}

// Shared locations & transport
const DC: [string, string] = ["Washington, D.C.", "United States"];
const PARIS: [string, string] = ["Paris", "France"];
const IMF_SHUTTLE = "IMF shuttle service";
const HOTEL_TRANSFER = "Hotel transfer arranged";

// IPs for actors
const IP_VASQUEZ = "10.0.42.118";
const IP_ASANTE = "10.0.42.205";
const IP_LAURENT = "10.0.55.42";
const IP_PATEL = "10.0.42.301";
const IP_CHEN = "10.0.42.88";
const IP_WILLIAMS = "10.0.42.150";
const IP_SYSTEM = "10.0.0.1";
const IP_UNDSS = "192.168.1.1";

export const travelers: Traveler[] = [
  { id: "t1", employeeId: "IMF-40231", name: "Elena Vasquez", email: "evasquez@imf.org", phone: "+1 (202) 555-0142", department: "Fiscal Affairs", division: "Tax Policy", dutyStation: "Washington, D.C." },
  { id: "t2", employeeId: "IMF-38764", name: "Kwame Asante", email: "kasante@imf.org", phone: "+1 (202) 555-0198", department: "African Department", division: "East Africa", dutyStation: "Washington, D.C." },
  { id: "t3", employeeId: "IMF-42108", name: "Sophie Laurent", email: "slaurent@imf.org", phone: "+33 1 40 69 30 00", department: "European Department", division: "Euro Area Policies", dutyStation: "Paris, France" },
  { id: "t4", employeeId: "IMF-39455", name: "Raj Patel", email: "rpatel@imf.org", phone: "+1 (202) 555-0267", department: "Statistics", division: "Data Management", dutyStation: "Washington, D.C." },
];

export const defaultWorkflowConfig: WorkflowConfig = {
  resubmitDirectlyToUN: false,
  allowReworkOnRejection: false,
};

export const travelRequests: TravelRequest[] = [
  {
    id: "req-001",
    travelReqNumber: "TR-2026-00142",
    status: "draft",
    traveler: travelers[0],
    primaryDestination: "Nairobi, Kenya",
    startDate: "2026-07-15",
    endDate: "2026-07-22",
    approver: "Michael Chen",
    createdAt: "2026-06-01T09:30:00Z",
    updatedAt: "2026-06-04T14:22:00Z",
    internalNotes: "Annual Article IV consultation with Kenya Central Bank",
    itinerary: [
      leg("leg-001a", 1, DC, ["Nairobi", "Kenya"], ["2026-07-15", "22:30"], ["2026-07-16", "18:45"], "flight", "Ethiopian Airlines", "ET 501", IMF_SHUTTLE, HOTEL_TRANSFER),
      leg("leg-001b", 2, ["Nairobi", "Kenya"], DC, ["2026-07-22", "23:15"], ["2026-07-23", "08:30"], "flight", "Ethiopian Airlines", "ET 500", HOTEL_TRANSFER, IMF_SHUTTLE),
    ],
    accommodations: [
      acc("acc-001a", "leg-001a", "Sarova Stanley Hotel", "2026-07-16", "2026-07-22", "SVS-294817", 245),
    ],
    countryStays: [stay("Kenya", "2026-07-16", "2026-07-22", 6, true)],
    comments: [],
    auditTrail: [
      audit("aud-001a", "2026-06-01T09:30:00Z", "Elena Vasquez", "requestor", "Created", "Travel request created as draft", IP_VASQUEZ),
      audit("aud-001b", "2026-06-04T14:22:00Z", "Elena Vasquez", "requestor", "Updated", "Added accommodation details", IP_VASQUEZ),
    ],
    validationIssues: [
      validation("val-001a", "itinerary[1].transportFromAirport", "warning", "Consider confirming airport transfer arrangements for return leg"),
    ],
  },
  {
    id: "req-002",
    travelReqNumber: "TR-2026-00138",
    status: "pending_approval",
    traveler: travelers[1],
    primaryDestination: "Addis Ababa, Ethiopia",
    startDate: "2026-07-08",
    endDate: "2026-07-18",
    approver: "Michael Chen",
    createdAt: "2026-05-28T11:15:00Z",
    updatedAt: "2026-06-02T16:45:00Z",
    internalNotes: "Regional economic outlook meeting with African Union",
    itinerary: [
      leg("leg-002a", 1, DC, ["Addis Ababa", "Ethiopia"], ["2026-07-08", "21:00"], ["2026-07-09", "19:30"], "flight", "Ethiopian Airlines", "ET 503", "Personal vehicle", "UN compound shuttle"),
      leg("leg-002b", 2, ["Addis Ababa", "Ethiopia"], ["Nairobi", "Kenya"], ["2026-07-14", "10:00"], ["2026-07-14", "12:15"], "flight", "Kenya Airways", "KQ 451", "UN compound shuttle", "Hotel transfer"),
      leg("leg-002c", 3, ["Nairobi", "Kenya"], DC, ["2026-07-18", "23:45"], ["2026-07-19", "09:00"], "flight", "Delta Air Lines", "DL 221", "Hotel transfer", IMF_SHUTTLE),
    ],
    accommodations: [
      acc("acc-002a", "leg-002a", "Hilton Addis Ababa", "2026-07-09", "2026-07-14", "HIL-482910", 195),
      acc("acc-002b", "leg-002b", "Sarova Stanley Hotel", "2026-07-14", "2026-07-18", "SVS-384729", 245),
    ],
    countryStays: [
      stay("Ethiopia", "2026-07-09", "2026-07-14", 5, true),
      stay("Kenya", "2026-07-14", "2026-07-18", 4, true),
    ],
    comments: [],
    auditTrail: [
      audit("aud-002a", "2026-05-28T11:15:00Z", "Kwame Asante", "requestor", "Created", "Travel request created", IP_ASANTE),
      audit("aud-002b", "2026-06-02T16:45:00Z", "Kwame Asante", "requestor", "Submitted", "Submitted for approval", IP_ASANTE),
    ],
    validationIssues: [],
  },
  {
    id: "req-003",
    travelReqNumber: "TR-2026-00135",
    status: "returned_by_approver",
    traveler: travelers[2],
    primaryDestination: "Tokyo, Japan",
    startDate: "2026-06-25",
    endDate: "2026-07-05",
    approver: "Michael Chen",
    createdAt: "2026-05-20T08:00:00Z",
    updatedAt: "2026-06-03T10:30:00Z",
    internalNotes: "G7 preparatory consultations with Bank of Japan",
    itinerary: [
      leg("leg-003a", 1, PARIS, ["Tokyo", "Japan"], ["2026-06-25", "13:30"], ["2026-06-26", "08:45"], "flight", "Air France", "AF 276", "RER B + OrlyVal", "Narita Express"),
      leg("leg-003b", 2, ["Tokyo", "Japan"], PARIS, ["2026-07-05", "10:15"], ["2026-07-05", "16:30"], "flight", "Air France", "AF 275", "Narita Express", "RER B + OrlyVal"),
    ],
    accommodations: [
      acc("acc-003a", "leg-003a", "Palace Hotel Tokyo", "2026-06-26", "2026-07-05", "PHT-192048", 380),
    ],
    countryStays: [stay("Japan", "2026-06-26", "2026-07-05", 9, false)],
    comments: [
      comment("cmt-003a", "Michael Chen", "approver", "Please clarify the purpose of 9 nights in Tokyo — standard G7 prep consultations are 5 business days. If additional meetings are planned, please add them to the justification notes.", "2026-06-03T10:30:00Z"),
    ],
    auditTrail: [
      audit("aud-003a", "2026-05-20T08:00:00Z", "Sophie Laurent", "requestor", "Created", "Travel request created", IP_LAURENT),
      audit("aud-003b", "2026-05-25T14:00:00Z", "Sophie Laurent", "requestor", "Submitted", "Submitted for approval", IP_LAURENT),
      audit("aud-003c", "2026-06-03T10:30:00Z", "Michael Chen", "approver", "Returned", "Returned for corrections — trip duration justification needed", IP_CHEN),
    ],
    validationIssues: [],
  },
  {
    id: "req-004",
    travelReqNumber: "TR-2026-00130",
    status: "approved",
    traveler: travelers[3],
    primaryDestination: "Lima, Peru",
    startDate: "2026-06-20",
    endDate: "2026-06-27",
    approver: "Sarah Williams",
    createdAt: "2026-05-15T13:00:00Z",
    updatedAt: "2026-06-01T09:15:00Z",
    internalNotes: "Statistical capacity building workshop",
    itinerary: [
      leg("leg-004a", 1, DC, ["Lima", "Peru"], ["2026-06-20", "08:00"], ["2026-06-20", "14:30"], "flight", "LATAM Airlines", "LA 2480", IMF_SHUTTLE, HOTEL_TRANSFER),
      leg("leg-004b", 2, ["Lima", "Peru"], DC, ["2026-06-27", "23:45"], ["2026-06-28", "07:15"], "flight", "LATAM Airlines", "LA 2481", HOTEL_TRANSFER, IMF_SHUTTLE),
    ],
    accommodations: [
      acc("acc-004a", "leg-004a", "JW Marriott Lima", "2026-06-20", "2026-06-27", "JWM-584920", 210),
    ],
    countryStays: [stay("Peru", "2026-06-20", "2026-06-27", 7, false)],
    comments: [
      comment("cmt-004a", "Sarah Williams", "approver", "Approved. Please ensure workshop materials are coordinated with Lima office beforehand.", "2026-06-01T09:15:00Z"),
    ],
    auditTrail: [
      audit("aud-004a", "2026-05-15T13:00:00Z", "Raj Patel", "requestor", "Created", "Travel request created", IP_PATEL),
      audit("aud-004b", "2026-05-28T11:00:00Z", "Raj Patel", "requestor", "Submitted", "Submitted for approval", IP_PATEL),
      audit("aud-004c", "2026-06-01T09:15:00Z", "Sarah Williams", "approver", "Approved", "Request approved", IP_WILLIAMS),
    ],
    validationIssues: [],
  },
  {
    id: "req-005",
    travelReqNumber: "TR-2026-00128",
    status: "sent_to_un",
    traveler: travelers[0],
    primaryDestination: "Kabul, Afghanistan",
    startDate: "2026-08-05",
    endDate: "2026-08-12",
    approver: "Michael Chen",
    createdAt: "2026-05-10T10:00:00Z",
    updatedAt: "2026-05-30T15:30:00Z",
    internalNotes: "Emergency fiscal assessment mission",
    itinerary: [
      leg("leg-005a", 1, DC, ["Dubai", "United Arab Emirates"], ["2026-08-05", "20:00"], ["2026-08-06", "16:30"], "flight", "Emirates", "EK 232", IMF_SHUTTLE, "Transit hotel shuttle"),
      leg("leg-005b", 2, ["Dubai", "United Arab Emirates"], ["Kabul", "Afghanistan"], ["2026-08-07", "06:00"], ["2026-08-07", "08:30"], "flight", "Kam Air", "RQ 320", "Transit hotel shuttle", "UN security escort"),
      leg("leg-005c", 3, ["Kabul", "Afghanistan"], ["Dubai", "United Arab Emirates"], ["2026-08-12", "10:00"], ["2026-08-12", "12:30"], "flight", "Kam Air", "RQ 321", "UN security escort", "Transit hotel shuttle"),
      leg("leg-005d", 4, ["Dubai", "United Arab Emirates"], DC, ["2026-08-13", "02:30"], ["2026-08-13", "08:00"], "flight", "Emirates", "EK 231", "Transit hotel shuttle", IMF_SHUTTLE),
    ],
    accommodations: [
      acc("acc-005a", "leg-005a", "Dubai International Hotel", "2026-08-06", "2026-08-07", "DIH-938271", 150),
      acc("acc-005b", "leg-005b", "Serena Hotel Kabul", "2026-08-07", "2026-08-12", "SHK-472019", 180),
      acc("acc-005c", "leg-005c", "Dubai International Hotel", "2026-08-12", "2026-08-13", "DIH-938285", 150),
    ],
    countryStays: [
      stay("United Arab Emirates", "2026-08-06", "2026-08-07", 1, false),
      stay("Afghanistan", "2026-08-07", "2026-08-12", 5, true),
      stay("United Arab Emirates", "2026-08-12", "2026-08-13", 1, false),
    ],
    comments: [
      comment("cmt-005a", "Michael Chen", "approver", "Approved with priority flag. Security clearance required for Afghanistan. Ensure all UN DSS protocols are followed.", "2026-05-30T15:30:00Z"),
    ],
    auditTrail: [
      audit("aud-005a", "2026-05-10T10:00:00Z", "Elena Vasquez", "requestor", "Created", "Travel request created", IP_VASQUEZ),
      audit("aud-005b", "2026-05-22T09:00:00Z", "Elena Vasquez", "requestor", "Submitted", "Submitted for approval", IP_VASQUEZ),
      audit("aud-005c", "2026-05-30T15:30:00Z", "Michael Chen", "approver", "Approved", "Request approved with priority flag", IP_CHEN),
      audit("aud-005d", "2026-05-30T15:31:00Z", "System", "administrator", "Sent to UN", "CSV payload generated and sent to UN Security", IP_SYSTEM),
    ],
    validationIssues: [],
  },
  {
    id: "req-006",
    travelReqNumber: "TR-2026-00125",
    status: "un_approved",
    traveler: travelers[1],
    primaryDestination: "Maputo, Mozambique",
    startDate: "2026-06-10",
    endDate: "2026-06-17",
    approver: "Sarah Williams",
    createdAt: "2026-04-28T14:00:00Z",
    updatedAt: "2026-05-25T11:00:00Z",
    internalNotes: "Debt sustainability analysis mission",
    unReferenceNumber: "UNDSS-2026-MZ-04821",
    unOfficerName: "Capt. James Okonkwo",
    unResponseTimestamp: "2026-05-25T11:00:00Z",
    unComments: "Security clearance granted. Standard protocols apply. Traveler should register with UNDSS Maputo upon arrival.",
    itinerary: [
      leg("leg-006a", 1, DC, ["Maputo", "Mozambique"], ["2026-06-10", "18:00"], ["2026-06-11", "15:30"], "flight", "South African Airways", "SA 204", IMF_SHUTTLE, "Embassy vehicle"),
      leg("leg-006b", 2, ["Maputo", "Mozambique"], DC, ["2026-06-17", "20:00"], ["2026-06-18", "07:45"], "flight", "South African Airways", "SA 205", "Embassy vehicle", IMF_SHUTTLE),
    ],
    accommodations: [
      acc("acc-006a", "leg-006a", "Polana Serena Hotel", "2026-06-11", "2026-06-17", "PSH-672841", 175),
    ],
    countryStays: [stay("Mozambique", "2026-06-11", "2026-06-17", 6, true)],
    comments: [
      comment("cmt-006a", "Sarah Williams", "approver", "Approved. Good preparation documentation.", "2026-05-15T09:00:00Z"),
    ],
    auditTrail: [
      audit("aud-006a", "2026-04-28T14:00:00Z", "Kwame Asante", "requestor", "Created", "Travel request created", IP_ASANTE),
      audit("aud-006b", "2026-05-10T11:00:00Z", "Kwame Asante", "requestor", "Submitted", "Submitted for approval", IP_ASANTE),
      audit("aud-006c", "2026-05-15T09:00:00Z", "Sarah Williams", "approver", "Approved", "Request approved", IP_WILLIAMS),
      audit("aud-006d", "2026-05-15T09:01:00Z", "System", "administrator", "Sent to UN", "CSV payload sent to UN Security", IP_SYSTEM),
      audit("aud-006e", "2026-05-25T11:00:00Z", "UNDSS", "administrator", "UN Approved", "Security clearance granted by Capt. James Okonkwo", IP_UNDSS),
    ],
    validationIssues: [],
  },
  {
    id: "req-007",
    travelReqNumber: "TR-2026-00120",
    status: "un_rejected",
    traveler: travelers[2],
    primaryDestination: "Bangui, Central African Republic",
    startDate: "2026-07-01",
    endDate: "2026-07-08",
    approver: "Michael Chen",
    createdAt: "2026-05-01T09:00:00Z",
    updatedAt: "2026-05-28T14:00:00Z",
    internalNotes: "Monetary policy technical assistance",
    unReferenceNumber: "UNDSS-2026-CF-03192",
    unOfficerName: "Maj. Anita Bergström",
    unResponseTimestamp: "2026-05-28T14:00:00Z",
    unComments: "Security clearance denied. Current security situation in Bangui does not permit non-essential travel. Recommend postponing to Q4 2026 pending security reassessment.",
    itinerary: [
      leg("leg-007a", 1, PARIS, ["Bangui", "Central African Republic"], ["2026-07-01", "09:00"], ["2026-07-01", "17:30"], "flight", "Air France", "AF 898", "Taxi", "UN security escort"),
      leg("leg-007b", 2, ["Bangui", "Central African Republic"], PARIS, ["2026-07-08", "18:00"], ["2026-07-09", "06:30"], "flight", "Air France", "AF 899", "UN security escort", "Taxi"),
    ],
    accommodations: [
      acc("acc-007a", "leg-007a", "Ledger Plaza Bangui", "2026-07-01", "2026-07-08", "LPB-294018", 165),
    ],
    countryStays: [stay("Central African Republic", "2026-07-01", "2026-07-08", 7, true)],
    comments: [
      comment("cmt-007a", "Michael Chen", "approver", "Approved. Mission is time-sensitive.", "2026-05-18T10:00:00Z"),
    ],
    auditTrail: [
      audit("aud-007a", "2026-05-01T09:00:00Z", "Sophie Laurent", "requestor", "Created", "Travel request created", IP_LAURENT),
      audit("aud-007b", "2026-05-15T16:00:00Z", "Sophie Laurent", "requestor", "Submitted", "Submitted for approval", IP_LAURENT),
      audit("aud-007c", "2026-05-18T10:00:00Z", "Michael Chen", "approver", "Approved", "Request approved", IP_CHEN),
      audit("aud-007d", "2026-05-18T10:01:00Z", "System", "administrator", "Sent to UN", "CSV payload sent to UN Security", IP_SYSTEM),
      audit("aud-007e", "2026-05-28T14:00:00Z", "UNDSS", "administrator", "UN Rejected", "Security clearance denied by Maj. Anita Bergström", IP_UNDSS),
    ],
    validationIssues: [],
  },
  {
    id: "req-008",
    travelReqNumber: "TR-2026-00145",
    status: "returned_by_un",
    traveler: travelers[3],
    primaryDestination: "Colombo, Sri Lanka",
    startDate: "2026-08-18",
    endDate: "2026-08-28",
    approver: "Sarah Williams",
    createdAt: "2026-05-20T07:30:00Z",
    updatedAt: "2026-06-05T13:00:00Z",
    internalNotes: "Data quality assessment and capacity building",
    unReferenceNumber: "UNDSS-2026-LK-05103",
    unOfficerName: "Lt. Col. Pierre Dubois",
    unResponseTimestamp: "2026-06-05T13:00:00Z",
    unComments: "Incomplete traveler documentation. Please provide: (1) valid diplomatic passport copy, (2) updated emergency contact information, (3) medical clearance certificate for tropical zone travel.",
    itinerary: [
      leg("leg-008a", 1, DC, ["Colombo", "Sri Lanka"], ["2026-08-18", "14:00"], ["2026-08-19", "18:30"], "flight", "Qatar Airways", "QR 764", IMF_SHUTTLE, HOTEL_TRANSFER),
      leg("leg-008b", 2, ["Colombo", "Sri Lanka"], DC, ["2026-08-28", "01:30"], ["2026-08-28", "14:00"], "flight", "Qatar Airways", "QR 765", HOTEL_TRANSFER, IMF_SHUTTLE),
    ],
    accommodations: [
      acc("acc-008a", "leg-008a", "Shangri-La Colombo", "2026-08-19", "2026-08-28", "SLC-841920", 230),
    ],
    countryStays: [stay("Sri Lanka", "2026-08-19", "2026-08-28", 9, true)],
    comments: [
      comment("cmt-008a", "Sarah Williams", "approver", "Approved.", "2026-05-30T08:00:00Z"),
      comment("cmt-008b", "UNDSS", "administrator", "Returned for corrections. Missing documentation — see UN comments above.", "2026-06-05T13:00:00Z"),
    ],
    auditTrail: [
      audit("aud-008a", "2026-05-20T07:30:00Z", "Raj Patel", "requestor", "Created", "Travel request created", IP_PATEL),
      audit("aud-008b", "2026-05-28T10:00:00Z", "Raj Patel", "requestor", "Submitted", "Submitted for approval", IP_PATEL),
      audit("aud-008c", "2026-05-30T08:00:00Z", "Sarah Williams", "approver", "Approved", "Request approved", IP_WILLIAMS),
      audit("aud-008d", "2026-05-30T08:01:00Z", "System", "administrator", "Sent to UN", "CSV payload sent to UN Security", IP_SYSTEM),
      audit("aud-008e", "2026-06-05T13:00:00Z", "UNDSS", "administrator", "Returned", "Returned for corrections — missing documentation", IP_UNDSS),
    ],
    validationIssues: [
      validation("val-008a", "traveler.passport", "error", "Diplomatic passport copy required by UN DSS"),
      validation("val-008b", "traveler.emergencyContact", "error", "Emergency contact information must be updated"),
      validation("val-008c", "traveler.medicalClearance", "error", "Medical clearance certificate required for tropical zone travel"),
    ],
  },
  {
    id: "req-009",
    travelReqNumber: "TR-2026-00148",
    status: "un_processing",
    traveler: travelers[0],
    primaryDestination: "Kinshasa, DR Congo",
    startDate: "2026-09-01",
    endDate: "2026-09-10",
    approver: "Michael Chen",
    createdAt: "2026-06-01T08:00:00Z",
    updatedAt: "2026-06-04T17:00:00Z",
    internalNotes: "Public financial management reform advisory",
    itinerary: [
      leg("leg-009a", 1, DC, ["Kinshasa", "Democratic Republic of the Congo"], ["2026-09-01", "19:00"], ["2026-09-02", "14:00"], "flight", "Ethiopian Airlines", "ET 509", IMF_SHUTTLE, "UN compound shuttle"),
      leg("leg-009b", 2, ["Kinshasa", "Democratic Republic of the Congo"], DC, ["2026-09-10", "22:00"], ["2026-09-11", "08:30"], "flight", "Ethiopian Airlines", "ET 510", "UN compound shuttle", IMF_SHUTTLE),
    ],
    accommodations: [
      acc("acc-009a", "leg-009a", "Pullman Kinshasa Grand Hotel", "2026-09-02", "2026-09-10", "PKG-203948", 200),
    ],
    countryStays: [stay("Democratic Republic of the Congo", "2026-09-02", "2026-09-10", 8, true)],
    comments: [],
    auditTrail: [
      audit("aud-009a", "2026-06-01T08:00:00Z", "Elena Vasquez", "requestor", "Created", "Travel request created", IP_VASQUEZ),
      audit("aud-009b", "2026-06-03T14:00:00Z", "Elena Vasquez", "requestor", "Submitted", "Submitted for approval", IP_VASQUEZ),
      audit("aud-009c", "2026-06-04T09:00:00Z", "Michael Chen", "approver", "Approved", "Request approved", IP_CHEN),
      audit("aud-009d", "2026-06-04T09:01:00Z", "System", "administrator", "Sent to UN", "CSV payload sent to UN Security", IP_SYSTEM),
    ],
    validationIssues: [],
  },
  {
    id: "req-010",
    travelReqNumber: "TR-2026-00150",
    status: "draft",
    traveler: travelers[2],
    primaryDestination: "Berlin, Germany",
    startDate: "2026-09-15",
    endDate: "2026-09-19",
    approver: "Michael Chen",
    createdAt: "2026-06-05T10:00:00Z",
    updatedAt: "2026-06-05T10:00:00Z",
    internalNotes: "",
    itinerary: [
      leg("leg-010a", 1, PARIS, ["Berlin", "Germany"], ["2026-09-15", "07:30"], ["2026-09-15", "09:30"], "train", "Deutsche Bahn", "ICE 9551", "Metro", "S-Bahn"),
      leg("leg-010b", 2, ["Berlin", "Germany"], PARIS, ["2026-09-19", "16:00"], ["2026-09-19", "18:00"], "train", "Deutsche Bahn", "ICE 9552", "S-Bahn", "Metro"),
    ],
    accommodations: [],
    countryStays: [stay("Germany", "2026-09-15", "2026-09-19", 4, false)],
    comments: [],
    auditTrail: [
      audit("aud-010a", "2026-06-05T10:00:00Z", "Sophie Laurent", "requestor", "Created", "Travel request created as draft", IP_LAURENT),
    ],
    validationIssues: [
      validation("val-010a", "accommodations", "error", "No accommodation details provided for Berlin stay"),
      validation("val-010b", "internalNotes", "warning", "Trip justification notes are empty"),
    ],
  },
];

export const initialEmails: SimulatedEmail[] = [
  { id: "email-001", to: "kasante@imf.org", subject: "Action Required: Your travel request TR-2026-00138 is pending approval", body: "Your travel request to Addis Ababa, Ethiopia has been submitted and is awaiting approval from Michael Chen.", timestamp: "2026-06-02T16:46:00Z", deepLink: "/requests/req-002", read: true },
  { id: "email-002", to: "slaurent@imf.org", subject: "Travel Request TR-2026-00135 Returned for Corrections", body: "Your travel request to Tokyo, Japan has been returned by the approver with comments. Please review the feedback and resubmit. Comment from Michael Chen: 'Please clarify the purpose of 9 nights in Tokyo.'", timestamp: "2026-06-03T10:31:00Z", deepLink: "/requests/req-003", read: false },
  { id: "email-003", to: "rpatel@imf.org", subject: "Travel Request TR-2026-00130 Approved", body: "Your travel request to Lima, Peru has been approved by Sarah Williams. The request will now proceed through the clearance pipeline.", timestamp: "2026-06-01T09:16:00Z", deepLink: "/requests/req-004", read: true },
  { id: "email-004", to: "evasquez@imf.org", subject: "UN Security Clearance: TR-2026-00128 Sent for Review", body: "Your travel request to Kabul, Afghanistan has been sent to UN Department of Safety and Security for clearance review.", timestamp: "2026-05-30T15:32:00Z", deepLink: "/requests/req-005/clearance", read: true },
  { id: "email-005", to: "kasante@imf.org", subject: "UN Security Clearance Granted: TR-2026-00125", body: "Your travel request to Maputo, Mozambique has received UN security clearance. Reference: UNDSS-2026-MZ-04821. Please proceed with final travel preparations.", timestamp: "2026-05-25T11:01:00Z", deepLink: "/requests/req-006/clearance", read: true },
  { id: "email-006", to: "slaurent@imf.org", subject: "URGENT: UN Security Clearance Denied — TR-2026-00120", body: "Your travel request to Bangui, Central African Republic has been denied by UN DSS. Reference: UNDSS-2026-CF-03192. Reason: Current security situation does not permit non-essential travel.", timestamp: "2026-05-28T14:01:00Z", deepLink: "/requests/req-007/clearance", read: false },
  { id: "email-007", to: "rpatel@imf.org", subject: "Action Required: UN Returned TR-2026-00145 for Corrections", body: "Your travel request to Colombo, Sri Lanka has been returned by UN DSS for missing documentation. Please provide the requested documents and resubmit.", timestamp: "2026-06-05T13:01:00Z", deepLink: "/requests/req-008", read: false },
];
