import type { TravelRequest, AdvancedFilters } from "@/types";

export function applyAdvancedFilters(
  requests: TravelRequest[],
  filters: AdvancedFilters,
  searchQuery?: string
): TravelRequest[] {
  let result = requests;

  // Status filter
  if (filters.statuses.length > 0) {
    result = result.filter((r) => filters.statuses.includes(r.status));
  }

  // Destination filter
  if (filters.destination) {
    result = result.filter((r) => r.primaryDestination === filters.destination);
  }

  // Date range filter
  if (filters.dateFrom) {
    result = result.filter(
      (r) => r.startDate && r.startDate >= filters.dateFrom!
    );
  }
  if (filters.dateTo) {
    result = result.filter(
      (r) => r.endDate && r.endDate <= filters.dateTo!
    );
  }

  // Approver filter
  if (filters.approver) {
    result = result.filter((r) => r.approver === filters.approver);
  }

  // Text search
  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    result = result.filter(
      (r) =>
        r.travelReqNumber.toLowerCase().includes(q) ||
        r.primaryDestination.toLowerCase().includes(q) ||
        r.traveler.name.toLowerCase().includes(q)
    );
  }

  // Sort
  result = [...result].sort((a, b) => {
    switch (filters.sortBy) {
      case "updated_newest":
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      case "updated_oldest":
        return new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
      case "travel_date_soonest":
        return (
          new Date(a.startDate || "9999").getTime() -
          new Date(b.startDate || "9999").getTime()
        );
      case "travel_date_latest":
        return (
          new Date(b.startDate || "0").getTime() -
          new Date(a.startDate || "0").getTime()
        );
      case "req_number_asc":
        return a.travelReqNumber.localeCompare(b.travelReqNumber);
      case "req_number_desc":
        return b.travelReqNumber.localeCompare(a.travelReqNumber);
      default:
        return 0;
    }
  });

  return result;
}
