"use client";

import { useMemo } from "react";
import type { TravelRequest, AdvancedFilters } from "@/types";

export function applyAdvancedFilters(
  requests: TravelRequest[],
  filters: AdvancedFilters
): TravelRequest[] {
  let result = requests;

  if (filters.statuses.length > 0) {
    result = result.filter((r) => filters.statuses.includes(r.status));
  }

  if (filters.destination) {
    result = result.filter((r) => r.primaryDestination === filters.destination);
  }

  if (filters.dateFrom) {
    result = result.filter((r) => r.startDate >= filters.dateFrom);
  }
  if (filters.dateTo) {
    result = result.filter((r) => r.endDate <= filters.dateTo);
  }

  if (filters.approver) {
    result = result.filter((r) => r.approver === filters.approver);
  }

  switch (filters.sortBy) {
    case "updated_newest":
      result = [...result].sort(
        (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
      break;
    case "updated_oldest":
      result = [...result].sort(
        (a, b) => new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()
      );
      break;
    case "travel_soonest":
      result = [...result].sort(
        (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
      );
      break;
    case "travel_latest":
      result = [...result].sort(
        (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
      );
      break;
    case "req_asc":
      result = [...result].sort((a, b) =>
        a.travelReqNumber.localeCompare(b.travelReqNumber)
      );
      break;
    case "req_desc":
      result = [...result].sort((a, b) =>
        b.travelReqNumber.localeCompare(a.travelReqNumber)
      );
      break;
  }

  return result;
}

export function useFilteredRequests(
  requests: TravelRequest[],
  filters: AdvancedFilters
): TravelRequest[] {
  return useMemo(
    () => applyAdvancedFilters(requests, filters),
    [requests, filters]
  );
}

export function hasActiveFilters(filters: AdvancedFilters): boolean {
  return (
    filters.statuses.length > 0 ||
    filters.destination !== "" ||
    filters.dateFrom !== "" ||
    filters.dateTo !== "" ||
    filters.approver !== "" ||
    filters.sortBy !== "updated_newest"
  );
}
