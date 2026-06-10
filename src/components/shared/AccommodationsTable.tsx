"use client";

import { Hotel } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Accommodation } from "@/types";
import { format } from "date-fns";

interface AccommodationsTableProps {
  accommodations: Accommodation[];
  showConfirmation?: boolean;
}

export function AccommodationsTable({ accommodations, showConfirmation = false }: AccommodationsTableProps) {
  if (accommodations.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Hotel className="h-5 w-5 text-[#004C97]" />
            Accommodations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center py-8 text-gray-400">
            <Hotel className="mb-2 h-8 w-8" />
            <p>No accommodations added</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Hotel className="h-5 w-5 text-[#004C97]" />
          Accommodations
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50">
              <TableHead>Hotel</TableHead>
              <TableHead>Check-in</TableHead>
              <TableHead>Check-out</TableHead>
              {showConfirmation && <TableHead>Confirmation #</TableHead>}
              <TableHead>Rate</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {accommodations.map((acc) => (
              <TableRow key={acc.id}>
                <TableCell className="font-medium">{acc.hotelName || "—"}</TableCell>
                <TableCell>
                  {acc.checkInDate ? format(new Date(acc.checkInDate), "MMM d, yyyy") : "—"}
                </TableCell>
                <TableCell>
                  {acc.checkOutDate ? format(new Date(acc.checkOutDate), "MMM d, yyyy") : "—"}
                </TableCell>
                {showConfirmation && (
                  <TableCell className="font-mono text-xs">
                    {acc.confirmationNumber || "—"}
                  </TableCell>
                )}
                <TableCell>
                  {acc.nightlyRate > 0 ? `$${acc.nightlyRate} ${acc.currency}/night` : "—"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
