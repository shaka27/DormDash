"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Home, Wrench, Clock, CheckCircle, AlertCircle, Phone, Mail, MapPin, User } from "lucide-react"
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

type RequestStatus = "pending" | "in-progress" | "completed"
type Urgency = "low" | "medium" | "high"

interface StudentMaintenancePageProps {
  requests: MaintenanceRequest[]
}

const StudentMaintenancePage: React.FC<StudentMaintenancePageProps> = ({ requests }) => {
  const [isNewRequestModalOpen, setIsNewRequestModalOpen] = useState(false)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState<MaintenanceRequest | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("all")

  // Filter requests based on active tab
  const filteredRequests = requests.filter(request => {
    if (activeTab === "all") return true
    return request.status === activeTab
  })

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

  const getStatusIcon = (status: RequestStatus) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />
      case "in-progress":
        return <Wrench className="h-4 w-4" />
      case "completed":
        return <CheckCircle className="h-4 w-4" />
      default:
        return <AlertCircle className="h-4 w-4" />
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
  const createRequest = async (requestData: {
    issue: string
    description: string
    priority: Urgency
    category: string
    room_number: string
  }) => {
    setIsLoading(true)
    try {
      await router.post('/maintenance', requestData, {
        onSuccess: () => {
          toast.success('Maintenance request submitted successfully!')
          setIsNewRequestModalOpen(false)
          router.reload()
        },
        onError: (errors) => {
          toast.error('Failed to submit request. Please try again.')
          console.error('Error creating request:', errors)
        }
      })
    } catch (error) {
      toast.error('Failed to submit request. Please try again.')
      console.error('Error creating request:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Component: Request Card
  const RequestCard: React.FC<{ request: MaintenanceRequest }> = ({ request }) => (
    <Card className="rounded-lg border-l-4 border-l-blue-500 hover:shadow-md transition-all duration-200 hover:scale-[1.02]">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            {getStatusIcon(request.status)}
            <h3 className="font-semibold text-gray-900 text-lg">{request.issue}</h3>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className={getUrgencyColor(request.priority)}>
              {request.priority}
            </Badge>
            <Badge className={`${getStatusColor(request.status)} text-white`}>
              {request.status.replace("-", " ")}
            </Badge>
          </div>
        </div>

        <p className="text-gray-600 mb-4 line-clamp-2">
          {request.description}
        </p>

        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-1" />
              <span>{request.room?.residence?.name} - Room {request.room?.number}</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              <span>{formatDate(request.reported_at)}</span>
            </div>
          </div>
          
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
        </div>
      </CardContent>
    </Card>
  )

  // Component: New Request Modal
  const NewRequestModal: React.FC = () => {
    const [formData, setFormData] = useState({
      issue: "",
      description: "",
      category: "general",
      priority: "medium" as Urgency,
      room_number: "",
    })

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()
      if (!formData.issue.trim()) {
        toast.error("Please enter an issue title")
        return
      }
      if (!formData.room_number.trim()) {
        toast.error("Please enter your room number")
        return
      }

      await createRequest(formData)
    }

    return (
      <Dialog open={isNewRequestModalOpen} onOpenChange={setIsNewRequestModalOpen}>
        <DialogContent className="sm:max-w-md bg-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-900">Report New Issue</DialogTitle>
            <DialogDescription>
              Fill out the form below to submit a maintenance request. We'll get back to you as soon as possible.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Issue Title *</label>
              <Input
                value={formData.issue}
                onChange={(e) => setFormData((prev) => ({ ...prev, issue: e.target.value }))}
                placeholder="e.g., Leaky faucet in bathroom"
                className="w-full"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Description</label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Please provide a detailed description of the problem..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Room Number *</label>
              <Input
                value={formData.room_number}
                onChange={(e) => setFormData((prev) => ({ ...prev, room_number: e.target.value }))}
                placeholder="e.g., 101, 202A, etc."
                className="w-full"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Category</label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
                >
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="plumbing">Plumbing</SelectItem>
                    <SelectItem value="electrical">Electrical</SelectItem>
                    <SelectItem value="furniture">Furniture</SelectItem>
                    <SelectItem value="heating">Heating/Cooling</SelectItem>
                    <SelectItem value="general">General</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Priority</label>
                <Select
                  value={formData.priority}
                  onValueChange={(value: Urgency) => setFormData((prev) => ({ ...prev, priority: value }))}
                >
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => setIsNewRequestModalOpen(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="flex-1 bg-blue-600 hover:bg-blue-700"
                disabled={isLoading}
              >
                {isLoading ? "Submitting..." : "Submit Request"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    )
  }

  // Component: Request Details Modal
  const RequestDetailsModal: React.FC = () => (
    <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
      <DialogContent className="max-w-2xl bg-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900">{selectedRequest?.issue}</DialogTitle>
        </DialogHeader>
        
        {selectedRequest && (
          <div className="space-y-6 mt-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
              <p className="text-gray-700">{selectedRequest.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Status & Priority</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Status:</span>
                      <Badge className={getStatusColor(selectedRequest.status)}>
                        {selectedRequest.status.replace("-", " ")}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Priority:</span>
                      <Badge variant="outline" className={getUrgencyColor(selectedRequest.priority)}>
                        {selectedRequest.priority}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Location</h4>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Home className="h-4 w-4" />
                    <span>{selectedRequest.room?.residence?.name} - Room {selectedRequest.room?.number}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Timeline</h4>
                  <div className="space-y-1 text-sm text-gray-600">
                    <div>Reported: {formatDate(selectedRequest.reported_at)}</div>
                    {selectedRequest.completed_at && (
                      <div>Completed: {formatDate(selectedRequest.completed_at)}</div>
                    )}
                  </div>
                </div>

                {selectedRequest.assigned_staff && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Assigned Staff</h4>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <User className="h-4 w-4" />
                      <span>{selectedRequest.assigned_staff}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {selectedRequest.staff_notes && (
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2">Staff Notes</h4>
                <p className="text-blue-800 text-sm">{selectedRequest.staff_notes}</p>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Student Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Wrench className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Student Maintenance Center</h1>
                <p className="text-gray-600 mt-1">Report and track your maintenance requests</p>
              </div>
            </div>
            
            <Button
              onClick={() => setIsNewRequestModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
              size="lg"
            >
              <Plus className="h-5 w-5 mr-2" />
              Report New Issue
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white rounded-xl shadow-sm border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Requests</p>
                  <p className="text-2xl font-bold text-gray-900">{requests.length}</p>
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
                  <p className="text-2xl font-bold text-yellow-600">
                    {requests.filter(r => r.status === 'pending').length}
                  </p>
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
                  <p className="text-2xl font-bold text-blue-600">
                    {requests.filter(r => r.status === 'in-progress').length}
                  </p>
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
                  <p className="text-2xl font-bold text-green-600">
                    {requests.filter(r => r.status === 'completed').length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Card className="bg-white rounded-xl shadow-sm border-0">
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle className="text-2xl font-bold text-gray-900">My Maintenance Requests</CardTitle>
                <CardDescription>
                  Track the progress of all your submitted maintenance requests
                </CardDescription>
              </div>
              
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full sm:w-auto mt-4 sm:mt-0">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="pending">Pending</TabsTrigger>
                  <TabsTrigger value="in-progress">In Progress</TabsTrigger>
                  <TabsTrigger value="completed">Completed</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>

          <CardContent>
            {filteredRequests.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Wrench className="h-10 w-10 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {activeTab === "all" ? "No maintenance requests yet" : `No ${activeTab} requests`}
                </h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  {activeTab === "all" 
                    ? "Get started by reporting your first maintenance issue. We're here to help!"
                    : `You don't have any ${activeTab} maintenance requests at the moment.`
                  }
                </p>
                {activeTab === "all" && (
                  <Button
                    onClick={() => setIsNewRequestModalOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Report Your First Issue
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredRequests.map((request) => (
                  <RequestCard key={request.id} request={request} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Emergency Contact Card */}
        <Card className="mt-8 bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-xl">
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-red-900 mb-2">Emergency Maintenance</h3>
                <p className="text-red-800 mb-4">
                  For urgent issues that require immediate attention (water leaks, electrical hazards, security concerns), 
                  please contact maintenance directly:
                </p>
                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6 space-y-2 sm:space-y-0">
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-red-600" />
                    <span className="text-red-800 font-medium">(555) 123-4567</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-red-600" />
                    <span className="text-red-800 font-medium">emergency-maintenance@nwu.edu</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <NewRequestModal />
      <RequestDetailsModal />
    </div>
  )
}

export default StudentMaintenancePage