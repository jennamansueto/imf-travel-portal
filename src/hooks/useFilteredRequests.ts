"use client";

import { useMemo } from "react";
import { useApp } from "@/contexts/AppContext";
import type { TravelRequest } from "@/types";

export function useFilteredRequests(baseRequests: TravelRequest[]): TravelRequest[] {
  const { advancedFilters } = useApp();

  return useMemo(() => {
    let result = [...baseRequests];

    // Status filter
    if (advancedFilters.statuses.length > 0) {
      result = result.filter((r) => advancedFilters.statuses.includes(r.status));
    }

    // Destination filter
    if (advancedFilters.destination) {
      result = result.filter(
        (r) => r.primaryDestination === advancedFilters.destination
      );
    }

    // Approver filter
    if (advancedFilters.approver) {
      result = result.filter((r) => r.approver === advancedFilters.approver);
    }

    // Date range filter
    if (advancedFilters.dateFrom) {
      result = result.filter((r) => r.startDate >= advancedFilters.dateFrom);
    }
    if (advancedFilters.dateTo) {
      result = result.filter((r) => r.endDate <= advancedFilters.dateTo);
    }

    // Sort
    switch (advancedFilters.sortBy) {
      case "updated_desc":
        result.sort(
          (a, b) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
        break;
      case "updated_asc":
        result.sort(
          (a, b) =>
            new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()
        );
        break;
      case "date_desc":
        result.sort(
          (a, b) =>
            new Date(b.startDate || 0).getTime() -
            new Date(a.startDate || 0).getTime()
        );
        break;
      case "date_asc":
        result.sort(
          (a, b) =>
            new Date(a.startDate || 0).getTime() -
            new Date(b.startDate || 0).getTime()
        );
        break;
    }

    return result;
  }, [baseRequests, advancedFilters]);
}
