"use client";

import React, { useState, useEffect } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface MaintenancePageProps {
  role: "student" | "admin";
}

interface Request {
  id: string;
  studentName: string;
  residence: string;
  roomNumber: string;
  issue: string;
  status: "pending" | "in-progress" | "resolved";
  createdAt: string;
  updatedAt?: string;
  scheduledDate?: string;
  staffNotes?: string;
}

// ---------- API FUNCTIONS ----------
const API_BASE = "http://localhost:8000/api"; // update if needed

const fetchRequests = async (): Promise<Request[]> => {
  const res = await fetch(`${API_BASE}/requests`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to fetch requests");
  return res.json();
};

const createRequest = async (requestData: Partial<Request>): Promise<Request> => {
  const res = await fetch(`${API_BASE}/requests`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(requestData),
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to create request");
  return res.json();
};

const updateRequest = async (id: string, updates: Partial<Request>): Promise<Request> => {
  const res = await fetch(`${API_BASE}/requests/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to update request");
  return res.json();
};

// ---------- MAIN COMPONENT ----------
export default function MaintenancePage({ role }: MaintenancePageProps) {
  const [activeRole, setActiveRole] = useState<"student" | "admin">(role);
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isNewRequestModalOpen, setIsNewRequestModalOpen] = useState(false);

  // fetch requests on load
  useEffect(() => {
    const loadRequests = async () => {
      setLoading(true);
      try {
        const data = await fetchRequests();
        setRequests(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadRequests();
  }, []);

  // ---------- Student view ----------
  const StudentView = () => (
    <div className="space-y-4">
      <Button
        style={{ backgroundColor: "#D6B4FC" }}
        onClick={() => setIsNewRequestModalOpen(true)}
      >
        New Maintenance Request
      </Button>

      <div className="grid gap-4 md:grid-cols-2">
        {requests.map((request) => (
          <Card
            key={request.id}
            className="cursor-pointer hover:shadow-lg transition"
            onClick={() => {
              setSelectedRequest(request);
              setIsDetailsModalOpen(true);
            }}
          >
            <CardContent className="p-4">
              <h3 className="font-semibold">{request.issue}</h3>
              <p className="text-sm text-gray-500">
                Status: {request.status}
              </p>
              <p className="text-xs text-gray-400">
                Submitted: {new Date(request.createdAt).toLocaleString()}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  // ---------- Admin view ----------
  const AdminView = () => (
    <Tabs defaultValue="pending">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="pending">Pending</TabsTrigger>
        <TabsTrigger value="in-progress">In Progress</TabsTrigger>
        <TabsTrigger value="resolved">Resolved</TabsTrigger>
      </TabsList>

      {["pending", "in-progress", "resolved"].map((status) => (
        <TabsContent key={status} value={status}>
          <div className="grid gap-4 md:grid-cols-2">
            {requests
              .filter((r) => r.status === status)
              .map((request) => (
                <Card
                  key={request.id}
                  className="cursor-pointer hover:shadow-lg transition"
                  onClick={() => {
                    setSelectedRequest(request);
                    setIsDetailsModalOpen(true);
                  }}
                >
                  <CardContent className="p-4">
                    <h3 className="font-semibold">{request.issue}</h3>
                    <p className="text-sm text-gray-500">
                      Room: {request.roomNumber} ({request.residence})
                    </p>
                    <p className="text-xs text-gray-400">
                      Submitted: {new Date(request.createdAt).toLocaleString()}
                    </p>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );

  // ---------- Request details modal ----------
  const RequestDetailsModal = () => {
    if (!selectedRequest) return null;

    return (
      <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request Details</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <p>
              <strong>Student:</strong> {selectedRequest.studentName}
            </p>
            <p>
              <strong>Residence:</strong> {selectedRequest.residence} - Room {selectedRequest.roomNumber}
            </p>
            <p>
              <strong>Issue:</strong> {selectedRequest.issue}
            </p>
            <p>
              <strong>Status:</strong> {selectedRequest.status}
            </p>
            {selectedRequest.staffNotes && (
              <p>
                <strong>Notes:</strong> {selectedRequest.staffNotes}
              </p>
            )}
          </div>

          {activeRole === "admin" && (
            <div className="space-y-2 mt-4">
              <Label htmlFor="statusSelect">Update Status</Label>
              <select
                id="statusSelect"
                defaultValue={selectedRequest.status}
                className="w-full border rounded p-2"
              >
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="resolved">Resolved</option>
              </select>

              <Label htmlFor="staffNotes">Staff Notes</Label>
              <Textarea
                id="staffNotes"
                defaultValue={selectedRequest.staffNotes}
                placeholder="Add notes for staff..."
              />

              <Button
                className="w-full"
                style={{ backgroundColor: "#D6B4FC" }}
                onClick={async () => {
                  const statusValue = (document.querySelector("#statusSelect") as HTMLSelectElement)?.value as
                    | "pending"
                    | "in-progress"
                    | "resolved";
                  const staffNotesValue = (document.querySelector("#staffNotes") as HTMLTextAreaElement)?.value || "";

                  const updates: Partial<Request> = {
                    status: statusValue,
                    staffNotes: staffNotesValue,
                  };

                  const updated = await updateRequest(selectedRequest.id, updates);

                  setRequests((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
                  setIsDetailsModalOpen(false);
                }}
              >
                Save Changes
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    );
  };

  // ---------- New request modal ----------
  const NewRequestModal = () => {
    const [formData, setFormData] = useState({
      residence: "",
      roomNumber: "",
      issue: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      const newReq = await createRequest({
        studentName: "Current Student", // replace with auth user later
        residence: formData.residence,
        roomNumber: formData.roomNumber,
        issue: formData.issue,
        status: "pending",
        createdAt: new Date().toISOString(),
      });
      setRequests((prev) => [newReq, ...prev]);
      setIsNewRequestModalOpen(false);
    };

    return (
      <Dialog open={isNewRequestModalOpen} onOpenChange={setIsNewRequestModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Maintenance Request</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <Label htmlFor="residence">Residence</Label>
              <Input id="residence" name="residence" value={formData.residence} onChange={handleChange} required />
            </div>
            <div>
              <Label htmlFor="roomNumber">Room Number</Label>
              <Input id="roomNumber" name="roomNumber" value={formData.roomNumber} onChange={handleChange} required />
            </div>
            <div>
              <Label htmlFor="issue">Issue</Label>
              <Textarea id="issue" name="issue" value={formData.issue} onChange={handleChange} required />
            </div>
            <Button type="submit" className="w-full" style={{ backgroundColor: "#D6B4FC" }}>
              Submit
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Maintenance Requests</h1>
        <div>
          <Button
            variant={activeRole === "student" ? "default" : "outline"}
            onClick={() => setActiveRole("student")}
            className="mr-2"
          >
            Student View
          </Button>
          <Button
            variant={activeRole === "admin" ? "default" : "outline"}
            onClick={() => setActiveRole("admin")}
          >
            Admin View
          </Button>
        </div>
      </div>

      {loading ? (
        <p>Loading requests...</p>
      ) : activeRole === "student" ? (
        <StudentView />
      ) : (
        <AdminView />
      )}

      <RequestDetailsModal />
      <NewRequestModal />
    </div>
  );
}
