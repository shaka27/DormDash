"use client"

/**
 * DormDash Maintenance Management Page
 * Dependencies: React, TypeScript, TailwindCSS, shadcn/ui components
 * Setup: Ensure shadcn/ui components are installed and Tailwind is configured
 * Colors: Primary Purple #D6B4FC, Accent Gold #EFBF04
 */

import React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Search, Plus, Filter, UserIcon, MapPin, Clock, AlertCircle } from "lucide-react"

// TypeScript interfaces
interface Request {
  id: string
  title: string
  description: string
  category: "plumbing" | "electrical" | "general"
  residence: string
  room: string
  status: "pending" | "in-progress" | "completed"
  urgency: "low" | "medium" | "high"
  studentName: string
  studentContact: string
  reportedDate: Date
  assignedStaff?: string
  staffNotes?: string
  scheduledDate?: Date
}

interface Residence {
  id: string
  name: string
}

type UserRole = "student" | "admin"
type RequestStatus = "pending" | "in-progress" | "completed"
type Urgency = "low" | "medium" | "high"

const MaintenancePage: React.FC = () => {
  // State management
  const [currentRole, setCurrentRole] = useState<UserRole>("student")
  const [requests, setRequests] = useState<Request[]>([])
  const [filteredRequests, setFilteredRequests] = useState<Request[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<RequestStatus[]>([])
  const [urgencyFilter, setUrgencyFilter] = useState<Urgency[]>([])
  const [residenceFilter, setResidenceFilter] = useState("all")
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "priority">("newest")
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [isNewRequestModalOpen, setIsNewRequestModalOpen] = useState(false)

  // Placeholder data
  const residences: Residence[] = [
    { id: "1", name: "North Hall" },
    { id: "2", name: "South Hall" },
    { id: "3", name: "East Wing" },
  ]

  const placeholderRequests: Request[] = [
    {
      id: "1",
      title: "Leaky Faucet in Bathroom",
      description:
        "The bathroom faucet has been dripping constantly for the past week. Water pressure is also very low.",
      category: "plumbing",
      residence: "North Hall",
      room: "204A",
      status: "pending",
      urgency: "medium",
      studentName: "John Smith",
      studentContact: "john.smith@nwu.edu",
      reportedDate: new Date("2024-01-15"),
      assignedStaff: "Mike Johnson",
    },
    {
      id: "2",
      title: "Electrical Outlet Not Working",
      description: "The outlet near my desk stopped working yesterday. I need it for my computer setup.",
      category: "electrical",
      residence: "South Hall",
      room: "301B",
      status: "in-progress",
      urgency: "high",
      studentName: "Sarah Davis",
      studentContact: "sarah.davis@nwu.edu",
      reportedDate: new Date("2024-01-14"),
      assignedStaff: "Tom Wilson",
    },
    {
      id: "3",
      title: "Broken Window Lock",
      description: "The window lock in my room is broken and won't secure properly. Security concern.",
      category: "general",
      residence: "East Wing",
      room: "105C",
      status: "completed",
      urgency: "high",
      studentName: "Mike Brown",
      studentContact: "mike.brown@nwu.edu",
      reportedDate: new Date("2024-01-10"),
      assignedStaff: "Lisa Chen",
    },
    {
      id: "4",
      title: "Heating Not Working",
      description: "Room temperature is very cold, heating system seems to be malfunctioning.",
      category: "general",
      residence: "North Hall",
      room: "150A",
      status: "pending",
      urgency: "high",
      studentName: "Emily Johnson",
      studentContact: "emily.johnson@nwu.edu",
      reportedDate: new Date("2024-01-16"),
    },
    {
      id: "5",
      title: "Shower Drain Clogged",
      description: "Water doesn't drain properly from the shower, creating standing water.",
      category: "plumbing",
      residence: "South Hall",
      room: "220B",
      status: "in-progress",
      urgency: "low",
      studentName: "Alex Wilson",
      studentContact: "alex.wilson@nwu.edu",
      reportedDate: new Date("2024-01-12"),
      assignedStaff: "Mike Johnson",
    },
    {
      id: "6",
      title: "Light Fixture Flickering",
      description: "The main ceiling light keeps flickering and sometimes goes out completely.",
      category: "electrical",
      residence: "East Wing",
      room: "275A",
      status: "completed",
      urgency: "medium",
      studentName: "Jessica Lee",
      studentContact: "jessica.lee@nwu.edu",
      reportedDate: new Date("2024-01-08"),
      assignedStaff: "Tom Wilson",
    },
  ]

  // API stub functions - TODO: Replace with actual Laravel API calls
  const fetchRequests = async (): Promise<Request[]> => {
    // TODO: API call - GET /api/requests
    return new Promise((resolve) => {
      setTimeout(() => resolve(placeholderRequests), 500)
    })
  }

  const createRequest = async (requestData: Partial<Request>): Promise<Request> => {
    // TODO: API call - POST /api/requests
    const newRequest: Request = {
      id: Date.now().toString(),
      title: requestData.title || "",
      description: requestData.description || "",
      category: requestData.category || "general",
      residence: requestData.residence || "",
      room: requestData.room || "",
      status: "pending",
      urgency: requestData.urgency || "medium",
      studentName: requestData.studentName || "Current User", // TODO: Get from auth
      studentContact: requestData.studentContact || "user@nwu.edu", // TODO: Get from auth
      reportedDate: new Date(),
      scheduledDate: requestData.scheduledDate,
    }
    return new Promise((resolve) => {
      setTimeout(() => resolve(newRequest), 300)
    })
  }

  const updateRequest = async (id: string, updates: Partial<Request>): Promise<Request> => {
    // TODO: API call - PATCH /api/requests/:id
    const updatedRequest = requests.find((r) => r.id === id)
    if (updatedRequest) {
      Object.assign(updatedRequest, updates)
    }
    return new Promise((resolve) => {
      setTimeout(() => resolve(updatedRequest!), 300)
    })
  }

  // Helper functions
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getStatusColor = (status: RequestStatus): string => {
    switch (status) {
      case "pending":
        return "bg-gray-500"
      case "in-progress":
        return "bg-[#D6B4FC]"
      case "completed":
        return "bg-[#EFBF04]"
      default:
        return "bg-gray-500"
    }
  }

  const getUrgencyColor = (urgency: Urgency): string => {
    switch (urgency) {
      case "low":
        return "bg-green-500"
      case "medium":
        return "bg-orange-500"
      case "high":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  // Effects
  useEffect(() => {
    fetchRequests().then(setRequests)
  }, [])

  useEffect(() => {
    let filtered = [...requests]

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (request) =>
          request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          request.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          request.studentName.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Status filter
    if (statusFilter.length > 0) {
      filtered = filtered.filter((request) => statusFilter.includes(request.status))
    }

    // Urgency filter
    if (urgencyFilter.length > 0) {
      filtered = filtered.filter((request) => urgencyFilter.includes(request.urgency))
    }

    // Residence filter
    if (residenceFilter !== "all") {
      filtered = filtered.filter((request) => request.residence === residenceFilter)
    }

    // Sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return b.reportedDate.getTime() - a.reportedDate.getTime()
        case "oldest":
          return a.reportedDate.getTime() - b.reportedDate.getTime()
        case "priority":
          const urgencyOrder = { high: 3, medium: 2, low: 1 }
          return urgencyOrder[b.urgency] - urgencyOrder[a.urgency]
        default:
          return 0
      }
    })

    setFilteredRequests(filtered)
  }, [requests, searchTerm, statusFilter, urgencyFilter, residenceFilter, sortBy])

  // Component: Top Banner
  const TopBanner: React.FC = () => (
    <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 mb-6">
      <div className="flex">
        <div className="flex-shrink-0">
          <AlertCircle className="h-5 w-5 text-yellow-500" />
        </div>
        <div className="ml-3">
          <p className="text-sm text-yellow-700">
            <strong>DormDash is currently under scheduled maintenance.</strong> Some features may be limited.
          </p>
        </div>
      </div>
    </div>
  )

  // Component: Top Navigation
  const TopNav: React.FC = () => (
    <nav className="bg-white shadow-sm border-b mb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-[#D6B4FC] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">DD</span>
              </div>
            </div>
            <div className="ml-4">
              <h1 className="text-xl font-semibold text-gray-900">Maintenance</h1>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )

  // Component: Role Toggle
  const RoleToggle: React.FC = () => (
    <div className="mb-6">
      <div className="flex items-center justify-center">
        <div className="bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setCurrentRole("student")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              currentRole === "student" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Student
          </button>
          <button
            onClick={() => setCurrentRole("admin")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              currentRole === "admin" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Admin
          </button>
        </div>
      </div>
      <p className="text-xs text-gray-500 text-center mt-2">Role switch simulated — replace with real auth later</p>
    </div>
  )

  // Component: Request Card
  const RequestCard: React.FC<{ request: Request; compact?: boolean }> = ({ request, compact = false }) => (
    <Card className="rounded-2xl shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className={`font-semibold text-gray-900 ${compact ? "text-sm" : "text-base"}`}>{request.title}</h3>
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${getUrgencyColor(request.urgency)}`} />
            <Badge className={`${getStatusColor(request.status)} text-white text-xs`}>
              {request.status.replace("-", " ")}
            </Badge>
          </div>
        </div>

        <p className={`text-gray-600 mb-3 ${compact ? "text-xs" : "text-sm"}`}>
          {compact ? `${request.description.substring(0, 80)}...` : request.description}
        </p>

        <div className={`flex items-center text-gray-500 mb-3 ${compact ? "text-xs" : "text-sm"}`}>
          <MapPin className="w-4 h-4 mr-1" />
          <span>
            {request.residence} - Room {request.room}
          </span>
          <Clock className="w-4 h-4 ml-4 mr-1" />
          <span>{formatDate(request.reportedDate)}</span>
        </div>

        {request.assignedStaff && (
          <div className={`flex items-center text-gray-500 mb-3 ${compact ? "text-xs" : "text-sm"}`}>
            <UserIcon className="w-4 h-4 mr-1" />
            <span>Assigned to: {request.assignedStaff}</span>
          </div>
        )}

        {!compact && (
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSelectedRequest(request)
                setIsDetailsModalOpen(true)
              }}
            >
              View Details
            </Button>
            {currentRole === "admin" && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  // TODO: Implement quick status update
                }}
              >
                Update Status
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )

  // Component: Request Details Modal
  const RequestDetailsModal: React.FC = () => (
    <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{selectedRequest?.title}</DialogTitle>
        </DialogHeader>
        {selectedRequest && (
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Description</h4>
              <p className="text-gray-600">{selectedRequest.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-1">Student</h4>
                <p className="text-sm text-gray-600">{selectedRequest.studentName}</p>
                <p className="text-sm text-gray-600">{selectedRequest.studentContact}</p>
              </div>
              <div>
                <h4 className="font-semibold mb-1">Location</h4>
                <p className="text-sm text-gray-600">{selectedRequest.residence}</p>
                <p className="text-sm text-gray-600">Room {selectedRequest.room}</p>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Photos</h4>
              <div className="grid grid-cols-3 gap-2">
                <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                  <span className="text-gray-400 text-sm">Photo 1</span>
                </div>
                <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                  <span className="text-gray-400 text-sm">Photo 2</span>
                </div>
                <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                  <span className="text-gray-400 text-sm">Photo 3</span>
                </div>
              </div>
            </div>

            {currentRole === "admin" && (
              <div className="space-y-4 border-t pt-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Status</label>
                  <Select defaultValue={selectedRequest.status}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Staff Notes</label>
                  <Textarea placeholder="Add notes about the repair..." defaultValue={selectedRequest.staffNotes} />
                </div>

                <Button
                  className="w-full"
                  style={{ backgroundColor: "#D6B4FC" }}
                  onClick={() => {
                    // TODO: Call updateRequest() with new data
                    setIsDetailsModalOpen(false)
                  }}
                >
                  Save Changes
                </Button>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )

  // Component: New Request Modal
  const NewRequestModal: React.FC = () => {
    const [formData, setFormData] = useState({
      title: "",
      description: "",
      category: "general" as const,
      residence: "",
      room: "",
      urgency: "medium" as const,
      scheduledDate: "",
    })

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()
      if (!formData.title || !formData.category) return

      const newRequest = await createRequest({
        ...formData,
        scheduledDate: formData.scheduledDate ? new Date(formData.scheduledDate) : undefined,
      })

      setRequests((prev) => [newRequest, ...prev])
      setIsNewRequestModalOpen(false)
      setFormData({
        title: "",
        description: "",
        category: "general",
        residence: "",
        room: "",
        urgency: "medium",
        scheduledDate: "",
      })
    }

    return (
      <Dialog open={isNewRequestModalOpen} onOpenChange={setIsNewRequestModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{currentRole === "admin" ? "Add New Request" : "Report an Issue"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title *</label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="Brief description of the issue"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Detailed description of the problem"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Category *</label>
              <Select
                value={formData.category}
                onValueChange={(value: any) => setFormData((prev) => ({ ...prev, category: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="plumbing">Plumbing</SelectItem>
                  <SelectItem value="electrical">Electrical</SelectItem>
                  <SelectItem value="general">General</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Residence</label>
                <Select
                  value={formData.residence}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, residence: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select residence" />
                  </SelectTrigger>
                  <SelectContent>
                    {residences.map((residence) => (
                      <SelectItem key={residence.id} value={residence.name}>
                        {residence.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Room</label>
                <Input
                  value={formData.room}
                  onChange={(e) => setFormData((prev) => ({ ...prev, room: e.target.value }))}
                  placeholder="Room number"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Urgency</label>
              <Select
                value={formData.urgency}
                onValueChange={(value: any) => setFormData((prev) => ({ ...prev, urgency: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Preferred Schedule (Optional)</label>
              <Input
                type="datetime-local"
                value={formData.scheduledDate}
                onChange={(e) => setFormData((prev) => ({ ...prev, scheduledDate: e.target.value }))}
              />
            </div>

            <Button type="submit" className="w-full" style={{ backgroundColor: "#D6B4FC" }}>
              Submit Request
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    )
  }

  // Component: Sidebar Filters
  const SidebarFilters: React.FC = () => (
    <div className="w-64 bg-white rounded-2xl shadow-sm p-6 h-fit">
      <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
        <Filter className="w-4 h-4 mr-2" />
        Filters
      </h3>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Status</label>
          <div className="space-y-2">
            {(["pending", "in-progress", "completed"] as RequestStatus[]).map((status) => (
              <label key={status} className="flex items-center">
                <input
                  type="checkbox"
                  checked={statusFilter.includes(status)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setStatusFilter((prev) => [...prev, status])
                    } else {
                      setStatusFilter((prev) => prev.filter((s) => s !== status))
                    }
                  }}
                  className="mr-2"
                />
                <span className="text-sm capitalize">{status.replace("-", " ")}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Urgency</label>
          <div className="space-y-2">
            {(["low", "medium", "high"] as Urgency[]).map((urgency) => (
              <label key={urgency} className="flex items-center">
                <input
                  type="checkbox"
                  checked={urgencyFilter.includes(urgency)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setUrgencyFilter((prev) => [...prev, urgency])
                    } else {
                      setUrgencyFilter((prev) => prev.filter((u) => u !== urgency))
                    }
                  }}
                  className="mr-2"
                />
                <div className="flex items-center">
                  <div className={`w-2 h-2 rounded-full ${getUrgencyColor(urgency)} mr-2`} />
                  <span className="text-sm capitalize">{urgency}</span>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Residence</label>
          <Select value={residenceFilter} onValueChange={setResidenceFilter}>
            <SelectTrigger>
              <SelectValue placeholder="All residences" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All residences</SelectItem>
              {residences.map((residence) => (
                <SelectItem key={residence.id} value={residence.name}>
                  {residence.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )

  // Component: Student View
  const StudentView: React.FC = () => {
    const studentRequests = filteredRequests.filter((r) => r.studentName === "Current User") // TODO: Filter by actual user

    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">DormDash Maintenance – Report or Track Issues</h2>
          <p className="text-gray-600">Submit maintenance requests and track their progress</p>
        </div>

        <Card className="rounded-2xl shadow-sm">
          <CardHeader>
            <CardTitle>Report New Issue</CardTitle>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => setIsNewRequestModalOpen(true)}
              className="w-full"
              style={{ backgroundColor: "#D6B4FC" }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Report an Issue
            </Button>
          </CardContent>
        </Card>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Track My Requests</h3>
          {studentRequests.length === 0 ? (
            <Card className="rounded-2xl shadow-sm">
              <CardContent className="text-center py-8">
                <p className="text-gray-500">No requests submitted yet</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {studentRequests.map((request) => (
                <RequestCard key={request.id} request={request} compact />
              ))}
            </div>
          )}
        </div>

        <Card className="rounded-2xl shadow-sm bg-blue-50">
          <CardContent className="p-4">
            <h4 className="font-semibold text-blue-900 mb-2">Need Help?</h4>
            <p className="text-sm text-blue-800 mb-2">For urgent issues, contact maintenance directly:</p>
            <p className="text-sm text-blue-800">📞 (555) 123-4567 | ✉️ maintenance@nwu.edu</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Component: Admin View
  const AdminView: React.FC = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">DormDash Maintenance Dashboard – Admin Access</h2>
          <p className="text-gray-600">Manage and track all maintenance requests</p>
        </div>
        <Button onClick={() => setIsNewRequestModalOpen(true)} style={{ backgroundColor: "#D6B4FC" }}>
          <Plus className="w-4 h-4 mr-2" />
          Add New Request
        </Button>
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search requests..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="oldest">Oldest First</SelectItem>
            <SelectItem value="priority">Priority (High → Low)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex gap-6">
        <div className="hidden lg:block">
          <SidebarFilters />
        </div>

        <div className="flex-1">
          {filteredRequests.length === 0 ? (
            <Card className="rounded-2xl shadow-sm">
              <CardContent className="text-center py-8">
                <p className="text-gray-500">No requests match your filters</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {filteredRequests.map((request) => (
                <RequestCard key={request.id} request={request} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )

  // Component: Footer
  const Footer: React.FC = () => (
    <footer className="bg-white border-t mt-12">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="w-8 h-8 bg-[#D6B4FC] rounded-lg flex items-center justify-center mr-3">
              <span className="text-white font-bold text-sm">DD</span>
            </div>
            <span className="text-lg font-semibold text-gray-900">DormDash</span>
          </div>
          <p className="text-sm text-gray-600 mb-2">Northwestern University • Residence Life & Housing</p>
          <p className="text-sm text-gray-600 mb-2">📞 (555) 123-4567 • ✉️ maintenance@nwu.edu</p>
          <p className="text-xs text-gray-500">© 2024 Northwestern University. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <TopBanner />
      <TopNav />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <RoleToggle />

        <main>{currentRole === "student" ? <StudentView /> : <AdminView />}</main>
      </div>

      <Footer />

      <RequestDetailsModal />
      <NewRequestModal />
    </div>
  )
}

export default MaintenancePage
