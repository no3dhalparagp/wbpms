"use client"

import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Building, Users, MapPin, Phone, Mail, Edit, Eye, Plus } from "lucide-react"
import Link from "next/link"

export default function AdminGPMgmtPage() {
  const { data: session } = useSession()

  if (!session?.user) {
    return <div>Please sign in to view GP management.</div>
  }

  // Mock GP data - in real app, this would come from API
  const gpData = {
    id: "gp-1",
    name: "Dhalpara Gram Panchayat",
    code: "GP001",
    state: "West Bengal",
    district: "Purba Medinipur",
    block: "Tamluk",
    address: "Dhalpara, Tamluk, Purba Medinipur, West Bengal",
    population: 15000,
    area: 25.5,
    sarpanchName: "Ramesh Kumar Mondal",
    secretaryName: "Priya Das",
    phoneNumber: "9876543210",
    email: "dhalpara.gp@example.com",
    isActive: true,
    villages: [
      { id: 1, name: "Dhalpara Village", population: 5000, area: 8.5, isActive: true },
      { id: 2, name: "Chakdighi Village", population: 3000, area: 6.2, isActive: true },
    ],
    wards: [
      { id: 1, name: "Ward 1", number: 1, population: 2500, isActive: true },
      { id: 2, name: "Ward 2", number: 2, population: 2000, isActive: true },
    ],
    staff: [
      { id: 1, name: "Priya Mondal", role: "STAFF", designation: "Clerk", isActive: true },
      { id: 2, name: "Suresh Roy", role: "STAFF", designation: "Data Entry Operator", isActive: true },
    ],
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">GP Management</h1>
          <p className="text-muted-foreground">Manage your assigned Gram Panchayat</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Eye className="h-4 w-4 mr-2" />
            View Reports
          </Button>
          <Button>
            <Edit className="h-4 w-4 mr-2" />
            Edit GP Details
          </Button>
        </div>
      </div>

      {/* GP Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Building className="h-5 w-5" />
            <span>{gpData.name}</span>
            <Badge variant={gpData.isActive ? "default" : "secondary"}>
              {gpData.isActive ? "Active" : "Inactive"}
            </Badge>
          </CardTitle>
          <CardDescription>Code: {gpData.code}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-semibold mb-2">Location</h4>
              <p className="text-sm text-muted-foreground">{gpData.state}, {gpData.district}</p>
              <p className="text-sm text-muted-foreground">Block: {gpData.block}</p>
              <p className="text-sm text-muted-foreground">{gpData.address}</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Demographics</h4>
              <p className="text-sm text-muted-foreground">Population: {gpData.population.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Area: {gpData.area} sq km</p>
              <p className="text-sm text-muted-foreground">Density: {Math.round(gpData.population / gpData.area)} per sq km</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Leadership</h4>
              <p className="text-sm text-muted-foreground">Sarpanch: {gpData.sarpanchName}</p>
              <p className="text-sm text-muted-foreground">Secretary: {gpData.secretaryName}</p>
              <div className="flex space-x-4 mt-2">
                <div className="flex items-center space-x-1 text-sm">
                  <Phone className="h-4 w-4" />
                  <span>{gpData.phoneNumber}</span>
                </div>
                <div className="flex items-center space-x-1 text-sm">
                  <Mail className="h-4 w-4" />
                  <span>{gpData.email}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Villages Management */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="h-5 w-5" />
                <span>Villages ({gpData.villages.length})</span>
              </CardTitle>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Village
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {gpData.villages.map((village) => (
                <div key={village.id} className="flex justify-between items-center p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{village.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      Population: {village.population.toLocaleString()} • Area: {village.area} sq km
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <Badge variant={village.isActive ? "default" : "secondary"}>
                      {village.isActive ? "Active" : "Inactive"}
                    </Badge>
                    <Button size="sm" variant="outline">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Wards Management */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Wards ({gpData.wards.length})</CardTitle>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Ward
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {gpData.wards.map((ward) => (
                <div key={ward.id} className="flex justify-between items-center p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{ward.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      Population: {ward.population.toLocaleString()}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <Badge variant="outline">Ward {ward.number}</Badge>
                    <Badge variant={ward.isActive ? "default" : "secondary"}>
                      {ward.isActive ? "Active" : "Inactive"}
                    </Badge>
                    <Button size="sm" variant="outline">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Staff Management */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>Staff ({gpData.staff.length})</span>
              </CardTitle>
              <Button size="sm" asChild>
                <Link href="/admin/users/register">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Staff
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {gpData.staff.map((member) => (
                <div key={member.id} className="flex justify-between items-center p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{member.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {member.designation} • {member.role}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <Badge variant={member.isActive ? "default" : "secondary"}>
                      {member.isActive ? "Active" : "Inactive"}
                    </Badge>
                    <Button size="sm" variant="outline">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" className="w-full justify-start">
              <Eye className="h-4 w-4 mr-2" />
              View Detailed Reports
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Edit className="h-4 w-4 mr-2" />
              Update GP Information
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Users className="h-4 w-4 mr-2" />
              Manage Staff Roles
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <MapPin className="h-4 w-4 mr-2" />
              Add New Village/Ward
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
