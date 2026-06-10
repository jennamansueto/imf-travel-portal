"use client";


import { travelers } from "@/data/seed";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const users = [
  ...travelers.map((t) => ({ ...t, role: "Requestor" as const, active: true })),
  {
    id: "u-approver-1",
    employeeId: "IMF-35120",
    name: "Michael Chen",
    email: "mchen@imf.org",
    phone: "+1 (202) 555-0333",
    department: "Management",
    division: "Travel Operations",
    dutyStation: "Washington, D.C.",
    role: "Approver" as const,
    active: true,
  },
  {
    id: "u-approver-2",
    employeeId: "IMF-36890",
    name: "Sarah Williams",
    email: "swilliams@imf.org",
    phone: "+1 (202) 555-0444",
    department: "Management",
    division: "Travel Operations",
    dutyStation: "Washington, D.C.",
    role: "Approver" as const,
    active: true,
  },
];

const roleColors = {
  Requestor: "bg-blue-100 text-blue-800",
  Approver: "bg-purple-100 text-purple-800",
  Administrator: "bg-emerald-100 text-emerald-800",
};

export default function UsersPage() {
  return (
    <div className="animate-in fade-in duration-300">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Users</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage system users and roles
        </p>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50">
              <TableHead className="font-semibold text-gray-700">User</TableHead>
              <TableHead className="font-semibold text-gray-700">Employee ID</TableHead>
              <TableHead className="font-semibold text-gray-700">Department</TableHead>
              <TableHead className="font-semibold text-gray-700">Duty Station</TableHead>
              <TableHead className="font-semibold text-gray-700">Role</TableHead>
              <TableHead className="font-semibold text-gray-700">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-[#004C97] text-xs text-white">
                        {user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="font-mono text-sm">
                  {user.employeeId}
                </TableCell>
                <TableCell className="text-sm text-gray-600">
                  {user.department}
                </TableCell>
                <TableCell className="text-sm text-gray-600">
                  {user.dutyStation}
                </TableCell>
                <TableCell>
                  <Badge className={roleColors[user.role]}>{user.role}</Badge>
                </TableCell>
                <TableCell>
                  <Badge className="bg-green-100 text-green-800">Active</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
