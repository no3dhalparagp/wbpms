export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

import { requireSuperAdmin } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Users, Building, Phone, Mail, Edit, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function SuperAdminGpDetailsPage({ params }: { params: { id: string } }) {
  await requireSuperAdmin();

  const gp = await prisma.gramPanchayat.findUnique({
    where: { id: params.id },
    include: {
      _count: {
        select: { users: true, villages: true, wards: true, warishApplications: true },
      },
    },
  });

  if (!gp) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="outline" size="sm" asChild>
            <Link href="/super-admin/gram-panchayats">
              <ArrowLeft className="h-4 w-4 mr-2" /> Back
            </Link>
          </Button>
        </div>
        <p className="text-muted-foreground">Gram Panchayat not found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{gp.name}</h1>
          <p className="text-muted-foreground">Code: {gp.code}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/super-admin/gram-panchayats">
              <ArrowLeft className="h-4 w-4 mr-2" /> Back
            </Link>
          </Button>
          <Button asChild>
            <Link href={`/super-admin/gram-panchayats/${gp.id}/edit`}>
              <Edit className="h-4 w-4 mr-2" /> Edit
            </Link>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MapPin className="mr-2 h-5 w-5" /> Basic Information
          </CardTitle>
          <CardDescription>Location and status</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <div className="text-sm text-muted-foreground">State</div>
              <div className="font-medium">{gp.state}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">District</div>
              <div className="font-medium">{gp.district}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Block</div>
              <div className="font-medium">{gp.block}</div>
            </div>
            {gp.pincode && (
              <div>
                <div className="text-sm text-muted-foreground">Pincode</div>
                <div className="font-medium">{gp.pincode}</div>
              </div>
            )}
            <div>
              <div className="text-sm text-muted-foreground">Status</div>
              <Badge variant={gp.isActive ? "default" : "destructive"}>
                {gp.isActive ? "Active" : "Inactive"}
              </Badge>
            </div>
          </div>
          {gp.address && (
            <div>
              <div className="text-sm text-muted-foreground">Address</div>
              <div className="font-medium">{gp.address}</div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center"><Users className="mr-2 h-5 w-5" /> Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{gp._count.users}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center"><Building className="mr-2 h-5 w-5" /> Villages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{gp._count.villages}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center"><MapPin className="mr-2 h-5 w-5" /> Wards</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{gp._count.wards}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center"><Phone className="mr-2 h-5 w-5" /> Contact</CardTitle>
          <CardDescription>Official contact details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {gp.phoneNumber && (
            <div className="flex items-center text-sm"><Phone className="h-4 w-4 mr-2" /> {gp.phoneNumber}</div>
          )}
          {gp.email && (
            <div className="flex items-center text-sm"><Mail className="h-4 w-4 mr-2" /> {gp.email}</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

