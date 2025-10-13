"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Search, Plus, Filter, UserIcon, MapPin, Clock, AlertCircle } from "lucide-react"
import { router } from '@inertiajs/react'
import { toast } from 'sonner'

// TypeScript interfaces
interface MaintenanceRequest {
  id: string
  user_id: string
  room_id: string
  issue: string
  description: string
  status: "pending" | "in-progress" | "completed"
  priority: "low" | "medium" | "high"
  reported_at: string
  completed_at: string | null
  assigned_staff: string | null
  staff_notes: string | null
  user?: {
    id: string
    name: string
    email: string
  }
  room?: {
    id: string
    number: string
    residence: {
      id: string
      name: string
    }
  }
}

interface Residence {
  id: string
  name: string
}

type RequestStatus = "pending" | "in-progress" | "completed"
type Urgency = "low" | "medium" | "high"

interface AdminMaintenancePageProps {
  initialRequests: MaintenanceRequest[]
}

const AdminMaintenancePage: React.FC<AdminMaintenancePageProps> = ({ initialRequests }) => {
  const [requests, setRequests] = useState<MaintenanceRequest[]>(initialRequests)
  const [filteredRequests, setFilteredRequests] = useState<MaintenanceRequest[]>(initialRequests)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<RequestStatus[]>([])
  const [urgencyFilter, setUrgencyFilter] = useState<Urgency[]>([])
  const [residenceFilter, setResidenceFilter] = useState("all")
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "priority">("newest")
  const [selectedRequest, setSelectedRequest] = useState<MaintenanceRequest | null>(null)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Get unique residences from requests
  const residences: Residence[] = Array.from(
    new Map(
      requests
        .filter(request => request.room?.residence)
        .map(request => {
          const residence = request.room!.residence;
          return [residence.id, residence];
        })
    ).values()
  )

  // Helper functions
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("en-US", {
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

  // API functions
  const updateRequest = async (id: string, updates: Partial<MaintenanceRequest>) => {
    setIsLoading(true)
    try {
      router.patch(`/admin/maintenance/${id}`, updates, {
        onSuccess: () => {
          toast.success('Maintenance request updated successfully.')
          setIsDetailsModalOpen(false)
          router.reload()
        },
        onError: (errors) => {
          toast.error('Failed to update request. Please try again.')
          console.error('Error updating request:', errors)
        }
      })
    } catch (error) {
      toast.error('Failed to update request. Please try again.')
      console.error('Error updating request:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Effects for filtering
  useEffect(() => {
    let filtered = [...requests]

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (request) =>
          request.issue.toLowerCase().includes(searchTerm.toLowerCase()) ||
          request.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          request.user?.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Status filter
    if (statusFilter.length > 0) {
      filtered = filtered.filter((request) => statusFilter.includes(request.status))
    }

    // Priority filter
    if (urgencyFilter.length > 0) {
      filtered = filtered.filter((request) => urgencyFilter.includes(request.priority))
    }

    // Residence filter
    if (residenceFilter !== "all") {
      filtered = filtered.filter((request) => request.room?.residence.name === residenceFilter)
    }

    // Sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.reported_at).getTime() - new Date(a.reported_at).getTime()
        case "oldest":
          return new Date(a.reported_at).getTime() - new Date(b.reported_at).getTime()
        case "priority":
          const priorityOrder = { high: 3, medium: 2, low: 1 }
          return priorityOrder[b.priority] - priorityOrder[a.priority]
        default:
          return 0
      }
    })

    setFilteredRequests(filtered)
  }, [requests, searchTerm, statusFilter, urgencyFilter, residenceFilter, sortBy])

  // Component: Request Card
  const RequestCard: React.FC<{ request: MaintenanceRequest }> = ({ request }) => (
    <Card className="rounded-2xl shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-gray-900 text-base">{request.issue}</h3>
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${getUrgencyColor(request.priority)}`} />
            <Badge className={`${getStatusColor(request.status)} text-white text-xs`}>
              {request.status.replace("-", " ")}
            </Badge>
          </div>
        </div>

        <p className="text-gray-600 mb-3 text-sm">
          {request.description.substring(0, 100)}...
        </p>

        <div className="flex items-center text-gray-500 mb-3 text-sm">
          <MapPin className="w-4 h-4 mr-1" />
          <span>
            {request.room?.residence?.name || 'Unknown Residence'} - Room {request.room?.number}
          </span>
          <Clock className="w-4 h-4 ml-4 mr-1" />
          <span>{formatDate(request.reported_at)}</span>
        </div>

        <div className="flex items-center text-gray-500 mb-3 text-sm">
          <UserIcon className="w-4 h-4 mr-1" />
          <span>Reported by: {request.user?.name}</span>
        </div>

        {request.assigned_staff && (
          <div className="flex items-center text-gray-500 mb-3 text-sm">
            <span>Assigned to: {request.assigned_staff}</span>
          </div>
        )}

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
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSelectedRequest(request)
              setIsDetailsModalOpen(true)
            }}
          >
            Update Status
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  // Component: Request Details Modal
  const RequestDetailsModal: React.FC = () => {
    const [status, setStatus] = useState<RequestStatus>(selectedRequest?.status || "pending")
    const [staffNotes, setStaffNotes] = useState(selectedRequest?.staff_notes || "")
    const [assignedStaff, setAssignedStaff] = useState(selectedRequest?.assigned_staff || "")

    const handleSave = () => {
      if (!selectedRequest) return

      const updates: Partial<MaintenanceRequest> = {
        status: status,
        staff_notes: staffNotes,
        assigned_staff: assignedStaff,
      }

      updateRequest(selectedRequest.id, updates)
    }

    return (
      <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedRequest?.issue}</DialogTitle>
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
                  <p className="text-sm text-gray-600">{selectedRequest.user?.name}</p>
                  <p className="text-sm text-gray-600">{selectedRequest.user?.email}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Location</h4>
                  <p className="text-sm text-gray-600">{selectedRequest.room?.residence.name}</p>
                  <p className="text-sm text-gray-600">Room {selectedRequest.room?.number}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-1">Reported Date</h4>
                  <p className="text-sm text-gray-600">{formatDate(selectedRequest.reported_at)}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Priority</h4>
                  <Badge className={getUrgencyColor(selectedRequest.priority)}>
                    {selectedRequest.priority}
                  </Badge>
                </div>
              </div>

              <div className="space-y-4 border-t pt-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Status</label>
                  <Select 
                    value={status} 
                    onValueChange={(value: string) => setStatus(value as RequestStatus)}
                  >
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
                  <label className="block text-sm font-medium mb-1">Assigned Staff</label>
                  <Input
                    value={assignedStaff}
                    onChange={(e) => setAssignedStaff(e.target.value)}
                    placeholder="Staff member name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Staff Notes</label>
                  <Textarea
                    value={staffNotes}
                    onChange={(e) => setStaffNotes(e.target.value)}
                    placeholder="Add notes about the repair..."
                  />
                </div>

                <Button
                  className="w-full"
                  style={{ backgroundColor: "#D6B4FC" }}
                  onClick={handleSave}
                  disabled={isLoading}
                >
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </div>
          )}
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
          <label className="block text-sm font-medium mb-2">Priority</label>
          <div className="space-y-2">
            {(["low", "medium", "high"] as Urgency[]).map((priority) => (
              <label key={priority} className="flex items-center">
                <input
                  type="checkbox"
                  checked={urgencyFilter.includes(priority)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setUrgencyFilter((prev) => [...prev, priority])
                    } else {
                      setUrgencyFilter((prev) => prev.filter((u) => u !== priority))
                    }
                  }}
                  className="mr-2"
                />
                <div className="flex items-center">
                  <div className={`w-2 h-2 rounded-full ${getUrgencyColor(priority)} mr-2`} />
                  <span className="text-sm capitalize">{priority}</span>
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin-specific header */}
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
                <h1 className="text-xl font-semibold text-gray-900">Maintenance Dashboard</h1>
                <p className="text-sm text-gray-600">Manage all maintenance requests</p>
              </div>
            </div>
            <Button onClick={() => router.visit('/admin/maintenance')} style={{ backgroundColor: "#D6B4FC" }}>
              Active Requests
            </Button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Maintenance Management</h2>
              <p className="text-gray-600">View and manage all maintenance requests</p>
            </div>
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
            <Select value={sortBy} onValueChange={(value: "newest" | "oldest" | "priority") => setSortBy(value)}>
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
      </div>

      <RequestDetailsModal />
    </div>
  )
}

export default AdminMaintenancePage