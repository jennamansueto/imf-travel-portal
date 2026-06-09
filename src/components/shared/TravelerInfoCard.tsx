"use client";

import { User, Lock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import type { Traveler } from "@/types";

interface TravelerInfoCardProps {
  traveler: Traveler;
  locked?: boolean;
}

export function TravelerInfoCard({ traveler, locked = false }: TravelerInfoCardProps) {
  const fields = [
    { label: "Employee Name", value: traveler.name },
    { label: "Employee ID", value: traveler.employeeId },
    { label: "Department", value: traveler.department },
    { label: "Division", value: traveler.division },
    { label: "Duty Station", value: traveler.dutyStation },
    { label: "Email", value: traveler.email },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <User className="h-5 w-5 text-[#002855]" />
          Traveler Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {fields.map((field) => (
            <div key={field.label}>
              <Label className="text-xs text-gray-500">{field.label}</Label>
              <p className="mt-0.5 flex items-center gap-1 text-sm font-medium">
                {locked && <Lock className="h-3 w-3 text-gray-300" />}
                {field.value}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
