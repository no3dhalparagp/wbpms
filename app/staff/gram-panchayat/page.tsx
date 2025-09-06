"use client"

import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Users, Building, Phone, Mail, Calendar } from "lucide-react"

export default function StaffGPInfoPage() {
  const { data: session } = useSession()

  if (!session?.user) {
    return <div>Please sign in to view GP information.</div>
  }

  // Mock GP data - in real app, this would come from API
  const gpData = {
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
    villages: [
      { name: "Dhalpara Village", population: 5000, area: 8.5 },
      { name: "Chakdighi Village", population: 3000, area: 6.2 },
    ],
    wards: [
      { name: "Ward 1", number: 1, population: 2500 },
      { name: "Ward 2", number: 2, population: 2000 },
    ],
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">GP Information</h1>
          <p className="text-muted-foreground">Details about your assigned Gram Panchayat</p>
        </div>
        <Badge variant="default" className="text-sm">
          {gpData.code}
        </Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Building className="h-5 w-5" />
              <span>Basic Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold text-lg">{gpData.name}</h4>
              <p className="text-muted-foreground">Code: {gpData.code}</p>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">State:</span>
                <p>{gpData.state}</p>
              </div>
              <div>
                <span className="font-medium">District:</span>
                <p>{gpData.district}</p>
              </div>
              <div>
                <span className="font-medium">Block:</span>
                <p>{gpData.block}</p>
              </div>
              <div>
                <span className="font-medium">Area:</span>
                <p>{gpData.area} sq km</p>
              </div>
            </div>
            <div>
              <span className="font-medium">Address:</span>
              <p className="text-sm text-muted-foreground">{gpData.address}</p>
            </div>
          </CardContent>
        </Card>

        {/* Population & Demographics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>Demographics</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">{gpData.population.toLocaleString()}</div>
              <p className="text-muted-foreground">Total Population</p>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Area:</span>
                <p>{gpData.area} sq km</p>
              </div>
              <div>
                <span className="font-medium">Density:</span>
                <p>{Math.round(gpData.population / gpData.area)} per sq km</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Leadership */}
        <Card>
          <CardHeader>
            <CardTitle>Leadership</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold">Sarpanch</h4>
              <p className="text-muted-foreground">{gpData.sarpanchName}</p>
            </div>
            <div>
              <h4 className="font-semibold">Secretary</h4>
              <p className="text-muted-foreground">{gpData.secretaryName}</p>
            </div>
            <div className="flex space-x-4 text-sm">
              <div className="flex items-center space-x-1">
                <Phone className="h-4 w-4" />
                <span>{gpData.phoneNumber}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Mail className="h-4 w-4" />
                <span>{gpData.email}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Villages */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MapPin className="h-5 w-5" />
              <span>Villages ({gpData.villages.length})</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {gpData.villages.map((village, index) => (
                <div key={index} className="flex justify-between items-center p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{village.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      Population: {village.population.toLocaleString()} • Area: {village.area} sq km
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Wards */}
        <Card>
          <CardHeader>
            <CardTitle>Wards ({gpData.wards.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {gpData.wards.map((ward, index) => (
                <div key={index} className="flex justify-between items-center p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{ward.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      Population: {ward.population.toLocaleString()}
                    </p>
                  </div>
                  <Badge variant="outline">Ward {ward.number}</Badge>
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
            <button className="w-full text-left p-3 border rounded-lg hover:bg-muted transition-colors">
              <h4 className="font-medium">View Reports</h4>
              <p className="text-sm text-muted-foreground">Access GP reports and statistics</p>
            </button>
            <button className="w-full text-left p-3 border rounded-lg hover:bg-muted transition-colors">
              <h4 className="font-medium">Update Information</h4>
              <p className="text-sm text-muted-foreground">Modify GP details and data</p>
            </button>
            <button className="w-full text-left p-3 border rounded-lg hover:bg-muted transition-colors">
              <h4 className="font-medium">Contact Leadership</h4>
              <p className="text-sm text-muted-foreground">Get in touch with Sarpanch or Secretary</p>
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
