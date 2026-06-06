"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import type {
  UserRole,
  TravelRequest,
  TravelRequestStatus,
  SimulatedEmail,
  WorkflowConfig,
  Comment,
  AuditEntry,
} from "@/types";
import { travelRequests as seedRequests, initialEmails, defaultWorkflowConfig } from "@/data/seed";

interface AppContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  requests: TravelRequest[];
  emails: SimulatedEmail[];
  workflowConfig: WorkflowConfig;
  setWorkflowConfig: (config: WorkflowConfig) => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  emailPanelOpen: boolean;
  setEmailPanelOpen: (open: boolean) => void;
  unreadEmailCount: number;
  updateRequestStatus: (
    requestId: string,
    newStatus: TravelRequestStatus,
    comment?: string,
    actor?: string
  ) => void;
  updateRequest: (requestId: string, updates: Partial<TravelRequest>) => void;
  addComment: (requestId: string, comment: Comment) => void;
  addAuditEntry: (requestId: string, entry: AuditEntry) => void;
  addEmail: (email: SimulatedEmail) => void;
  markEmailRead: (emailId: string) => void;
  simulateUNResponse: (
    requestId: string,
    response: "approved" | "rejected" | "returned"
  ) => void;
  createNewRequest: () => TravelRequest;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<UserRole>("requestor");
  const [requests, setRequests] = useState<TravelRequest[]>(seedRequests);
  const [emails, setEmails] = useState<SimulatedEmail[]>(initialEmails);
  const [workflowConfig, setWorkflowConfig] =
    useState<WorkflowConfig>(defaultWorkflowConfig);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [emailPanelOpen, setEmailPanelOpen] = useState(false);

  const unreadEmailCount = emails.filter((e) => !e.read).length;

  const updateRequestStatus = useCallback(
    (
      requestId: string,
      newStatus: TravelRequestStatus,
      comment?: string,
      actor?: string
    ) => {
      setRequests((prev) =>
        prev.map((req) => {
          if (req.id !== requestId) return req;
          const now = new Date().toISOString();
          const updatedComments = comment
            ? [
                ...req.comments,
                {
                  id: `cmt-${Date.now()}`,
                  author: actor || "System",
                  authorRole: role,
                  content: comment,
                  timestamp: now,
                },
              ]
            : req.comments;

          const actionMap: Record<TravelRequestStatus, string> = {
            draft: "Draft",
            pending_approval: "Submitted",
            returned_by_approver: "Returned by Approver",
            approved: "Approved",
            sent_to_un: "Sent to UN",
            un_processing: "UN Processing",
            un_approved: "UN Approved",
            un_rejected: "UN Rejected",
            returned_by_un: "Returned by UN",
          };

          return {
            ...req,
            status: newStatus,
            updatedAt: now,
            comments: updatedComments,
            auditTrail: [
              ...req.auditTrail,
              {
                id: `aud-${Date.now()}`,
                timestamp: now,
                actor: actor || "System",
                actorRole: role,
                action: actionMap[newStatus],
                details: comment || `Status changed to ${newStatus}`,
                ipAddress: "10.0.42.118",
              },
            ],
          };
        })
      );
    },
    [role]
  );

  const updateRequest = useCallback(
    (requestId: string, updates: Partial<TravelRequest>) => {
      setRequests((prev) =>
        prev.map((req) =>
          req.id === requestId
            ? { ...req, ...updates, updatedAt: new Date().toISOString() }
            : req
        )
      );
    },
    []
  );

  const addComment = useCallback((requestId: string, comment: Comment) => {
    setRequests((prev) =>
      prev.map((req) =>
        req.id === requestId
          ? { ...req, comments: [...req.comments, comment] }
          : req
      )
    );
  }, []);

  const addAuditEntry = useCallback(
    (requestId: string, entry: AuditEntry) => {
      setRequests((prev) =>
        prev.map((req) =>
          req.id === requestId
            ? { ...req, auditTrail: [...req.auditTrail, entry] }
            : req
        )
      );
    },
    []
  );

  const addEmail = useCallback((email: SimulatedEmail) => {
    setEmails((prev) => [email, ...prev]);
  }, []);

  const markEmailRead = useCallback((emailId: string) => {
    setEmails((prev) =>
      prev.map((e) => (e.id === emailId ? { ...e, read: true } : e))
    );
  }, []);

  const simulateUNResponse = useCallback(
    (
      requestId: string,
      response: "approved" | "rejected" | "returned"
    ) => {
      const now = new Date().toISOString();
      const statusMap = {
        approved: "un_approved" as TravelRequestStatus,
        rejected: "un_rejected" as TravelRequestStatus,
        returned: "returned_by_un" as TravelRequestStatus,
      };
      const commentMap = {
        approved:
          "Security clearance granted. Standard travel protocols apply.",
        rejected:
          "Security clearance denied. Current conditions do not permit travel to this destination.",
        returned:
          "Returned for corrections. Additional documentation required before clearance can be processed.",
      };

      setRequests((prev) =>
        prev.map((req) => {
          if (req.id !== requestId) return req;
          return {
            ...req,
            status: statusMap[response],
            updatedAt: now,
            unReferenceNumber: `UNDSS-2026-${Date.now().toString().slice(-5)}`,
            unOfficerName: "Col. Maria Santos",
            unResponseTimestamp: now,
            unComments: commentMap[response],
            auditTrail: [
              ...req.auditTrail,
              {
                id: `aud-${Date.now()}`,
                timestamp: now,
                actor: "UNDSS",
                actorRole: "administrator" as UserRole,
                action:
                  response === "approved"
                    ? "UN Approved"
                    : response === "rejected"
                      ? "UN Rejected"
                      : "Returned by UN",
                details: commentMap[response],
                ipAddress: "192.168.1.1",
              },
            ],
            comments: [
              ...req.comments,
              {
                id: `cmt-${Date.now()}`,
                author: "UNDSS",
                authorRole: "administrator" as UserRole,
                content: commentMap[response],
                timestamp: now,
              },
            ],
          };
        })
      );

      const request = requests.find((r) => r.id === requestId);
      if (request) {
        addEmail({
          id: `email-${Date.now()}`,
          to: request.traveler.email,
          subject: `UN Security Clearance ${response === "approved" ? "Granted" : response === "rejected" ? "Denied" : "Returned"}: ${request.travelReqNumber}`,
          body: commentMap[response],
          timestamp: now,
          deepLink: `/requests/${requestId}/clearance`,
          read: false,
        });
      }
    },
    [requests, addEmail]
  );

  const createNewRequest = useCallback((): TravelRequest => {
    const now = new Date().toISOString();
    const reqNum = `TR-2026-${String(Math.floor(10000 + Math.random() * 90000))}`;
    const newReq: TravelRequest = {
      id: `req-${Date.now()}`,
      travelReqNumber: reqNum,
      status: "draft",
      traveler: {
        id: "t1",
        employeeId: "IMF-40231",
        name: "Elena Vasquez",
        email: "evasquez@imf.org",
        phone: "+1 (202) 555-0142",
        department: "Fiscal Affairs",
        division: "Tax Policy",
        dutyStation: "Washington, D.C.",
      },
      primaryDestination: "",
      startDate: "",
      endDate: "",
      approver: "Michael Chen",
      createdAt: now,
      updatedAt: now,
      internalNotes: "",
      itinerary: [],
      accommodations: [],
      countryStays: [],
      comments: [],
      auditTrail: [
        {
          id: `aud-${Date.now()}`,
          timestamp: now,
          actor: "Elena Vasquez",
          actorRole: "requestor",
          action: "Created",
          details: "Travel request created as draft",
          ipAddress: "10.0.42.118",
        },
      ],
      validationIssues: [],
    };
    setRequests((prev) => [newReq, ...prev]);
    return newReq;
  }, []);

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        requests,
        emails,
        workflowConfig,
        setWorkflowConfig,
        sidebarCollapsed,
        setSidebarCollapsed,
        emailPanelOpen,
        setEmailPanelOpen,
        unreadEmailCount,
        updateRequestStatus,
        updateRequest,
        addComment,
        addAuditEntry,
        addEmail,
        markEmailRead,
        simulateUNResponse,
        createNewRequest,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
