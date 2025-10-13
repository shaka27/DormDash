"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Plus, Filter, User, MapPin, Clock, AlertCircle, Wrench, CheckCircle, BarChart3, Download } from "lucide-react"
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
  requests: MaintenanceRequest[]
}

const AdminMaintenancePage: React.FC<AdminMaintenancePageProps> = ({ requests }) => {
  const [filteredRequests, setFilteredRequests] = useState<MaintenanceRequest[]>(requests)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<RequestStatus[]>([])
  const [urgencyFilter, setUrgencyFilter] = useState<Urgency[]>([])
  const [residenceFilter, setResidenceFilter] = useState("all")
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "priority">("newest")
  const [selectedRequest, setSelectedRequest] = useState<MaintenanceRequest | null>(null)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [activeView, setActiveView] = useState<"list" | "grid">("grid")

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
      hour: "2-digit",
      minute: "2-digit"
    })
  }

  const getStatusColor = (status: RequestStatus): string => {
    switch (status) {
      case "pending":
        return "bg-yellow-500"
      case "in-progress":
        return "bg-blue-500"
      case "completed":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  const getUrgencyColor = (urgency: Urgency): string => {
    switch (urgency) {
      case "low":
        return "bg-green-100 text-green-800 border-green-200"
      case "medium":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "high":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  // API functions
  const updateRequest = async (id: string, updates: Partial<MaintenanceRequest>) => {
    setIsLoading(true)
    try {
      await router.patch(`/admin/maintenance/${id}`, updates, {
        onSuccess: () => {
          toast.success('Maintenance request updated successfully!')
          setIsDetailsModalOpen(false)
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
          request.user?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          request.room?.number.toLowerCase().includes(searchTerm.toLowerCase())
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

  // Statistics
  const stats = {
    total: requests.length,
    pending: requests.filter(r => r.status === 'pending').length,
    inProgress: requests.filter(r => r.status === 'in-progress').length,
    completed: requests.filter(r => r.status === 'completed').length,
    highPriority: requests.filter(r => r.priority === 'high').length,
  }

  // Component: Request Card
  const RequestCard: React.FC<{ request: MaintenanceRequest }> = ({ request }) => (
    <Card className="rounded-lg border-l-4 border-l-blue-500 hover:shadow-lg transition-all duration-200 hover:scale-[1.02]">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-semibold text-gray-900 text-lg mb-1">{request.issue}</h3>
            <p className="text-gray-600 text-sm line-clamp-2">{request.description}</p>
          </div>
          <div className="flex flex-col items-end space-y-2">
            <Badge variant="outline" className={getUrgencyColor(request.priority)}>
              {request.priority}
            </Badge>
            <Badge className={`${getStatusColor(request.status)} text-white`}>
              {request.status.replace("-", " ")}
            </Badge>
          </div>
        </div>

        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <User className="h-4 w-4 mr-2" />
              <span>{request.user?.name}</span>
            </div>
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-2" />
              <span>{request.room?.residence?.name} - {request.room?.number}</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2" />
              <span>{formatDate(request.reported_at)}</span>
            </div>
            {request.assigned_staff && (
              <Badge variant="secondary" className="text-xs">
                {request.assigned_staff}
              </Badge>
            )}
          </div>
        </div>

        <div className="flex space-x-2 mt-4">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => {
              setSelectedRequest(request)
              setIsDetailsModalOpen(true)
            }}
          >
            View Details
          </Button>
          <Button
            size="sm"
            className="flex-1 bg-blue-600 hover:bg-blue-700"
            onClick={() => {
              setSelectedRequest(request)
              setIsDetailsModalOpen(true)
            }}
          >
            Manage
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
        <DialogContent className="max-w-4xl bg-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-900">{selectedRequest?.issue}</DialogTitle>
            <DialogDescription>
              Manage this maintenance request and update its status
            </DialogDescription>
          </DialogHeader>
          
          {selectedRequest && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
              {/* Left Column - Request Details */}
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Request Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
                      <p className="text-gray-700 bg-gray-50 rounded-lg p-3">{selectedRequest.description}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Student Information</h4>
                        <div className="space-y-1 text-sm">
                          <div className="flex items-center">
                            <User className="h-4 w-4 mr-2 text-gray-500" />
                            <span>{selectedRequest.user?.name}</span>
                          </div>
                          <div className="flex items-center">
                            <span className="text-gray-500 mr-2">📧</span>
                            <span>{selectedRequest.user?.email}</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Location</h4>
                        <div className="space-y-1 text-sm">
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                            <span>{selectedRequest.room?.residence?.name}</span>
                          </div>
                          <div className="flex items-center">
                            <span className="text-gray-500 mr-2">🚪</span>
                            <span>Room {selectedRequest.room?.number}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Timeline</h4>
                        <div className="space-y-1 text-sm text-gray-600">
                          <div>Reported: {formatDate(selectedRequest.reported_at)}</div>
                          {selectedRequest.completed_at && (
                            <div>Completed: {formatDate(selectedRequest.completed_at)}</div>
                          )}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Current Status</h4>
                        <div className="space-y-2">
                          <Badge className={getStatusColor(selectedRequest.status)}>
                            {selectedRequest.status.replace("-", " ")}
                          </Badge>
                          <Badge variant="outline" className={getUrgencyColor(selectedRequest.priority)}>
                            {selectedRequest.priority} Priority
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column - Management */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Manage Request</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Status</label>
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

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Assigned Staff</label>
                      <Input
                        value={assignedStaff}
                        onChange={(e) => setAssignedStaff(e.target.value)}
                        placeholder="Enter staff member name"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Staff Notes</label>
                      <Textarea
                        value={staffNotes}
                        onChange={(e) => setStaffNotes(e.target.value)}
                        placeholder="Add notes about the repair progress..."
                        rows={4}
                      />
                    </div>

                    <Button
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      onClick={handleSave}
                      disabled={isLoading}
                    >
                      {isLoading ? "Saving Changes..." : "Save Changes"}
                    </Button>
                  </CardContent>
                </Card>

                {selectedRequest.staff_notes && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Previous Notes</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
                        {selectedRequest.staff_notes}
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    )
  }

  // Component: Sidebar Filters
  const SidebarFilters: React.FC = () => (
    <Card className="bg-white rounded-xl shadow-sm border-0">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Filter className="h-5 w-5 mr-2" />
          Filters & Sorting
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Status</label>
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
                    className="mr-2 rounded border-gray-300"
                  />
                  <span className="text-sm capitalize">{status.replace("-", " ")}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Priority</label>
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
                    className="mr-2 rounded border-gray-300"
                  />
                  <div className="flex items-center">
                    <div className={`w-2 h-2 rounded-full mr-2 ${
                      priority === 'high' ? 'bg-red-500' : 
                      priority === 'medium' ? 'bg-orange-500' : 'bg-green-500'
                    }`} />
                    <span className="text-sm capitalize">{priority}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Residence</label>
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

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Sort By</label>
            <Select value={sortBy} onValueChange={(value: "newest" | "oldest" | "priority") => setSortBy(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="priority">Priority (High → Low)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button
          variant="outline"
          className="w-full"
          onClick={() => {
            setStatusFilter([])
            setUrgencyFilter([])
            setResidenceFilter("all")
            setSearchTerm("")
          }}
        >
          Clear All Filters
        </Button>
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Admin Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <Wrench className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Maintenance Dashboard</h1>
                <p className="text-gray-600 mt-1">Manage all maintenance requests across residences</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button variant="outline" className="flex items-center">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button 
                onClick={() => router.visit('/admin/maintenance')}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                View Analytics
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <Card className="bg-white rounded-xl shadow-sm border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Requests</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <AlertCircle className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white rounded-xl shadow-sm border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white rounded-xl shadow-sm border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">In Progress</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.inProgress}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Wrench className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white rounded-xl shadow-sm border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white rounded-xl shadow-sm border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">High Priority</p>
                  <p className="text-2xl font-bold text-red-600">{stats.highPriority}</p>
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <AlertCircle className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Filters */}
          <div className="lg:col-span-1">
            <SidebarFilters />
          </div>

          {/* Requests List */}
          <div className="lg:col-span-3">
            <Card className="bg-white rounded-xl shadow-sm border-0">
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <CardTitle className="text-2xl font-bold text-gray-900">
                      Maintenance Requests ({filteredRequests.length})
                    </CardTitle>
                    <CardDescription>
                      Manage and track all maintenance requests across all residences
                    </CardDescription>
                  </div>
                  
                  <div className="flex items-center space-x-3 mt-4 sm:mt-0">
                    <div className="flex-1 relative min-w-[300px]">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Search requests, students, or rooms..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    
                    <Button
                      variant="outline"
                      onClick={() => setActiveView(activeView === "grid" ? "list" : "grid")}
                    >
                      {activeView === "grid" ? "List View" : "Grid View"}
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                {filteredRequests.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Wrench className="h-10 w-10 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No maintenance requests found</h3>
                    <p className="text-gray-600 max-w-md mx-auto">
                      {searchTerm || statusFilter.length > 0 || urgencyFilter.length > 0 || residenceFilter !== "all"
                        ? "Try adjusting your filters or search terms to see more results."
                        : "No maintenance requests have been submitted yet."
                      }
                    </p>
                  </div>
                ) : (
                  <div className={`grid gap-4 ${
                    activeView === "grid" 
                      ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3" 
                      : "grid-cols-1"
                  }`}>
                    {filteredRequests.map((request) => (
                      <RequestCard key={request.id} request={request} />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <RequestDetailsModal />
    </div>
  )
}

export default AdminMaintenancePage