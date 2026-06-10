"use client";

import { Globe } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { CountryStay } from "@/types";
import { format } from "date-fns";

interface CountryStayTableProps {
  countryStays: CountryStay[];
  dateFormat?: string;
}

export function CountryStayTable({ countryStays, dateFormat = "MMM d, yyyy" }: CountryStayTableProps) {
  if (countryStays.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Globe className="h-5 w-5 text-[#004C97]" />
            Country Stay Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="py-4 text-center text-sm text-gray-400">
            Country stays auto-calculated from itinerary
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Globe className="h-5 w-5 text-[#004C97]" />
          Country Stay Summary
        </CardTitle>
      </CardHeader>
      <CardContent>
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
            {countryStays.map((cs) => (
              <TableRow key={cs.country}>
                <TableCell className="font-medium">{cs.country}</TableCell>
                <TableCell>{format(new Date(cs.entryDate), dateFormat)}</TableCell>
                <TableCell>{format(new Date(cs.exitDate), dateFormat)}</TableCell>
                <TableCell>{cs.totalNights}</TableCell>
                <TableCell>
                  {cs.requiresUNClearance ? (
                    <Badge className="bg-amber-100 text-amber-800 border-amber-300">Required</Badge>
                  ) : (
                    <Badge variant="secondary">Not Required</Badge>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
