import { requireStaff } from "@/lib/auth-utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Mail, Calendar, Shield, User, Edit } from "lucide-react"

export default async function StaffProfilePage() {
  const session = await requireStaff()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
        <p className="text-muted-foreground">View and manage your account information</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Profile Card */}
        <Card className="md:col-span-1">
          <CardHeader className="text-center">
            <Avatar className="h-24 w-24 mx-auto mb-4">
              <AvatarImage src={session.user.image || ""} alt={session.user.name || ""} />
              <AvatarFallback className="text-2xl">
                {session.user.name?.charAt(0) || session.user.email?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            <CardTitle>{session.user.name || "No name set"}</CardTitle>
            <CardDescription>{session.user.email}</CardDescription>
            <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 mx-auto">
              {session.user.role.replace("_", " ")}
            </Badge>
          </CardHeader>
          <CardContent>
            <Button className="w-full bg-transparent" variant="outline">
              <Edit className="mr-2 h-4 w-4" />
              Edit Profile
            </Button>
          </CardContent>
        </Card>

        {/* Account Details */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Account Details</CardTitle>
            <CardDescription>Your account information and settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <User className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Full Name</p>
                    <p className="text-sm text-muted-foreground">{session.user.name || "Not set"}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Email Address</p>
                    <p className="text-sm text-muted-foreground">{session.user.email}</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Shield className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Role</p>
                    <p className="text-sm text-muted-foreground">{session.user.role.replace("_", " ")}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Account Status</p>
                    <p className="text-sm text-muted-foreground">{session.user.isActive ? "Active" : "Inactive"}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Permissions and Access */}
      <Card>
        <CardHeader>
          <CardTitle>Permissions & Access</CardTitle>
          <CardDescription>What you can access with your current role</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h4 className="font-medium mb-3 text-green-700">Available Features</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center space-x-2">
                  <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                  <span>View personal dashboard</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                  <span>Access staff area</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                  <span>Update personal profile</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                  <span>View assigned tasks</span>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-3 text-red-700">Restricted Features</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center space-x-2">
                  <div className="h-2 w-2 bg-red-500 rounded-full"></div>
                  <span>User management</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="h-2 w-2 bg-red-500 rounded-full"></div>
                  <span>System administration</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="h-2 w-2 bg-red-500 rounded-full"></div>
                  <span>Role modifications</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="h-2 w-2 bg-red-500 rounded-full"></div>
                  <span>Super admin features</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Help and Support */}
      <Card>
        <CardHeader>
          <CardTitle>Help & Support</CardTitle>
          <CardDescription>Need assistance or have questions?</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Contact Admin</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Reach out to administrators for role changes or system issues
              </p>
              <Button variant="outline" size="sm">
                Send Message
              </Button>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Documentation</h4>
              <p className="text-sm text-muted-foreground mb-3">Access user guides and system documentation</p>
              <Button variant="outline" size="sm">
                View Docs
              </Button>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Report Issue</h4>
              <p className="text-sm text-muted-foreground mb-3">Report technical problems or bugs</p>
              <Button variant="outline" size="sm">
                Report Bug
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
