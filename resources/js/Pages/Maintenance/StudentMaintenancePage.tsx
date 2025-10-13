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

type RequestStatus = "pending" | "in-progress" | "completed"
type Urgency = "low" | "medium" | "high"

interface StudentMaintenancePageProps {
  initialRequests: MaintenanceRequest[]
}

const StudentMaintenancePage: React.FC<StudentMaintenancePageProps> = ({ initialRequests }) => {
  const [requests, setRequests] = useState<MaintenanceRequest[]>(initialRequests)
  const [isNewRequestModalOpen, setIsNewRequestModalOpen] = useState(false)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState<MaintenanceRequest | null>(null)
  const [isLoading, setIsLoading] = useState(false)

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
  const createRequest = async (requestData: {
    issue: string
    description: string
    priority: Urgency
    category: string
  }) => {
    setIsLoading(true)
    try {
      router.post('/maintenance', requestData, {
        onSuccess: () => {
          toast.success('Maintenance request submitted successfully.')
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
          {request.description}
        </p>

        <div className="flex items-center text-gray-500 mb-3 text-sm">
          <MapPin className="w-4 h-4 mr-1" />
          <span>
            {request.room?.residence?.name || 'Unknown Residence'} - Room {request.room?.number}
          </span>
          <Clock className="w-4 h-4 ml-4 mr-1" />
          <span>{formatDate(request.reported_at)}</span>
        </div>

        {request.assigned_staff && (
          <div className="flex items-center text-gray-500 mb-3 text-sm">
            <UserIcon className="w-4 h-4 mr-1" />
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
    })

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()
      if (!formData.issue) return

      await createRequest(formData)
    }

    return (
      <Dialog open={isNewRequestModalOpen} onOpenChange={setIsNewRequestModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Report an Issue</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Issue Title *</label>
              <Input
                value={formData.issue}
                onChange={(e) => setFormData((prev) => ({ ...prev, issue: e.target.value }))}
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
              <label className="block text-sm font-medium mb-1">Category</label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="plumbing">Plumbing</SelectItem>
                  <SelectItem value="electrical">Electrical</SelectItem>
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="furniture">Furniture</SelectItem>
                  <SelectItem value="heating">Heating/Cooling</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Priority</label>
              <Select
                value={formData.priority}
                onValueChange={(value: Urgency) => setFormData((prev) => ({ ...prev, priority: value }))}
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

            <Button 
              type="submit" 
              className="w-full" 
              style={{ backgroundColor: "#D6B4FC" }}
              disabled={isLoading}
            >
              {isLoading ? "Submitting..." : "Submit Request"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    )
  }

  // Component: Request Details Modal
  const RequestDetailsModal: React.FC = () => (
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
                <h4 className="font-semibold mb-1">Status</h4>
                <Badge className={getStatusColor(selectedRequest.status)}>
                  {selectedRequest.status.replace("-", " ")}
                </Badge>
              </div>
              <div>
                <h4 className="font-semibold mb-1">Priority</h4>
                <Badge className={getUrgencyColor(selectedRequest.priority)}>
                  {selectedRequest.priority}
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-1">Location</h4>
                <p className="text-sm text-gray-600">{selectedRequest.room?.residence?.name}</p>
                <p className="text-sm text-gray-600">Room {selectedRequest.room?.number}</p>
              </div>
              <div>
                <h4 className="font-semibold mb-1">Reported Date</h4>
                <p className="text-sm text-gray-600">{formatDate(selectedRequest.reported_at)}</p>
              </div>
            </div>

            {selectedRequest.assigned_staff && (
              <div>
                <h4 className="font-semibold mb-1">Assigned Staff</h4>
                <p className="text-sm text-gray-600">{selectedRequest.assigned_staff}</p>
              </div>
            )}

            {selectedRequest.staff_notes && (
              <div>
                <h4 className="font-semibold mb-1">Staff Notes</h4>
                <p className="text-sm text-gray-600">{selectedRequest.staff_notes}</p>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Student-specific header */}
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
                <h1 className="text-xl font-semibold text-gray-900">Maintenance Requests</h1>
                <p className="text-sm text-gray-600">Report and track your maintenance issues</p>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Maintenance Requests</h2>
            <p className="text-gray-600">Submit maintenance requests and track their progress</p>
          </div>

          {/* Report New Issue Card */}
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

          {/* My Requests Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">My Requests</h3>
            {requests.length === 0 ? (
              <Card className="rounded-2xl shadow-sm">
                <CardContent className="text-center py-8">
                  <p className="text-gray-500">No requests submitted yet</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {requests.map((request) => (
                  <RequestCard key={request.id} request={request} />
                ))}
              </div>
            )}
          </div>

          {/* Help Card */}
          <Card className="rounded-2xl shadow-sm bg-blue-50">
            <CardContent className="p-4">
              <h4 className="font-semibold text-blue-900 mb-2">Need Immediate Help?</h4>
              <p className="text-sm text-blue-800 mb-2">For urgent issues, contact maintenance directly:</p>
              <p className="text-sm text-blue-800">📞 (555) 123-4567 | ✉️ maintenance@nwu.edu</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <NewRequestModal />
      <RequestDetailsModal />
    </div>
  )
}

export default StudentMaintenancePage