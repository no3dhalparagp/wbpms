export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, MapPin, Users, Building } from "lucide-react"
import Link from "next/link"

async function getGramPanchayats() {
  return await prisma.gramPanchayat.findMany({
    include: {
      users: {
        select: { id: true, role: true },
      },
      villages: {
        select: { id: true },
      },
      wards: {
        select: { id: true },
      },
    },
    orderBy: { name: "asc" },
  })
}

export default async function GramPanchayatsPage() {
  const gramPanchayats = await getGramPanchayats()

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Gram Panchayats</h1>
          <p className="text-muted-foreground">Manage all Gram Panchayats in the system</p>
        </div>
        <Button asChild>
          <Link href="/super-admin/gram-panchayats/new">
            <Plus className="h-4 w-4 mr-2" />
            Add New GP
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {gramPanchayats.map((gp) => (
          <Card key={gp.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{gp.name}</CardTitle>
                  <CardDescription>Code: {gp.code}</CardDescription>
                </div>
                <Badge variant={gp.isActive ? "default" : "secondary"}>{gp.isActive ? "Active" : "Inactive"}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 mr-2" />
                {gp.district}, {gp.state}
              </div>

              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="flex items-center justify-center mb-1">
                    <Users className="h-4 w-4" />
                  </div>
                  <div className="text-2xl font-bold">{gp.users.length}</div>
                  <div className="text-xs text-muted-foreground">Staff</div>
                </div>
                <div>
                  <div className="flex items-center justify-center mb-1">
                    <Building className="h-4 w-4" />
                  </div>
                  <div className="text-2xl font-bold">{gp.villages.length}</div>
                  <div className="text-xs text-muted-foreground">Villages</div>
                </div>
                <div>
                  <div className="flex items-center justify-center mb-1">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <div className="text-2xl font-bold">{gp.wards.length}</div>
                  <div className="text-xs text-muted-foreground">Wards</div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" asChild className="flex-1 bg-transparent">
                  <Link href={`/super-admin/gram-panchayats/${gp.id}`}>View Details</Link>
                </Button>
                <Button variant="outline" size="sm" asChild className="flex-1 bg-transparent">
                  <Link href={`/super-admin/gram-panchayats/${gp.id}/edit`}>Edit</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {gramPanchayats.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Building className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Gram Panchayats Found</h3>
            <p className="text-muted-foreground mb-4">Get started by adding your first Gram Panchayat to the system.</p>
            <Button asChild>
              <Link href="/super-admin/gram-panchayats/new">
                <Plus className="h-4 w-4 mr-2" />
                Add First GP
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
