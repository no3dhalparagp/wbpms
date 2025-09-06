"use client"

import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckSquare, Clock, AlertCircle, CheckCircle2 } from "lucide-react"

export default function StaffTasksPage() {
  const { data: session } = useSession()

  if (!session?.user) {
    return <div>Please sign in to view your tasks.</div>
  }

  // Mock tasks data - in real app, this would come from API
  const tasks = [
    {
      id: 1,
      title: "Update Village Population Data",
      description: "Collect and update population data for Dhalpara Village",
      status: "pending",
      priority: "high",
      dueDate: "2024-01-15",
      assignedBy: "Rajesh Kumar",
    },
    {
      id: 2,
      title: "Verify Aadhar Card Applications",
      description: "Review and verify 25 pending Aadhar card applications",
      status: "in_progress",
      priority: "medium",
      dueDate: "2024-01-20",
      assignedBy: "Rajesh Kumar",
    },
    {
      id: 3,
      title: "Prepare Monthly Report",
      description: "Compile monthly activity report for January 2024",
      status: "completed",
      priority: "low",
      dueDate: "2024-01-10",
      assignedBy: "Rajesh Kumar",
    },
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-4 w-4 text-green-600" />
      case "in_progress":
        return <Clock className="h-4 w-4 text-blue-600" />
      case "pending":
        return <AlertCircle className="h-4 w-4 text-yellow-600" />
      default:
        return <CheckSquare className="h-4 w-4" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge variant="default" className="bg-green-100 text-green-800">Completed</Badge>
      case "in_progress":
        return <Badge variant="default" className="bg-blue-100 text-blue-800">In Progress</Badge>
      case "pending":
        return <Badge variant="default" className="bg-yellow-100 text-yellow-800">Pending</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge variant="destructive">High Priority</Badge>
      case "medium":
        return <Badge variant="default">Medium Priority</Badge>
      case "low":
        return <Badge variant="secondary">Low Priority</Badge>
      default:
        return <Badge variant="outline">{priority}</Badge>
    }
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Tasks</h1>
          <p className="text-muted-foreground">Manage your assigned tasks and activities</p>
        </div>
        <Button>
          <CheckSquare className="h-4 w-4 mr-2" />
          Mark All Complete
        </Button>
      </div>

      <div className="grid gap-4">
        {tasks.map((task) => (
          <Card key={task.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2">
                  {getStatusIcon(task.status)}
                  <CardTitle className="text-lg">{task.title}</CardTitle>
                </div>
                <div className="flex space-x-2">
                  {getStatusBadge(task.status)}
                  {getPriorityBadge(task.priority)}
                </div>
              </div>
              <CardDescription>
                Assigned by: {task.assignedBy} • Due: {task.dueDate}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">{task.description}</p>
              <div className="flex space-x-2">
                <Button size="sm" variant="outline">
                  View Details
                </Button>
                {task.status !== "completed" && (
                  <Button size="sm">
                    Mark Complete
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {tasks.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <CheckSquare className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No tasks assigned</h3>
            <p className="text-muted-foreground text-center">
              You don't have any tasks assigned at the moment. Check back later or contact your administrator.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
