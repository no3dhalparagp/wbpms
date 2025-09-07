import { requireSuperAdmin } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  MapPin,
  Search,
  Filter,
  Eye,
  Edit,
  Plus,
  Users,
  FileText,
  Building,
  Phone,
  Mail,
} from "lucide-react";
import { auth } from "@/auth";
import Link from "next/link";

async function getAllGramPanchayats() {
  const gramPanchayats = await prisma.gramPanchayat.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: {
          users: true,
          villages: true,
          wards: true,
          warishApplications: true,
        },
      },
    },
  });

  return gramPanchayats;
}

async function getGramPanchayatStats() {
  const [
    totalGramPanchayats,
    activeGramPanchayats,
    inactiveGramPanchayats,
    totalUsers,
    totalApplications,
  ] = await Promise.all([
    prisma.gramPanchayat.count(),
    prisma.gramPanchayat.count({ where: { isActive: true } }),
    prisma.gramPanchayat.count({ where: { isActive: false } }),
    prisma.user.count(),
    prisma.warishApplication.count(),
  ]);

  return {
    totalGramPanchayats,
    activeGramPanchayats,
    inactiveGramPanchayats,
    totalUsers,
    totalApplications,
  };
}

export default async function SuperAdminGramPanchayatsPage() {
  await requireSuperAdmin();
  const gramPanchayats = await getAllGramPanchayats();
  const stats = await getGramPanchayatStats();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Gram Panchayat Management
          </h1>
          <p className="text-muted-foreground">
            Manage all Gram Panchayats in the system
          </p>
        </div>
        <Button asChild>
          <Link href="/super-admin/gram-panchayats/new">
            <Plus className="h-4 w-4 mr-2" />
            Add Gram Panchayat
          </Link>
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total GPs</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.totalGramPanchayats}
            </div>
            <p className="text-xs text-muted-foreground">All Gram Panchayats</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <MapPin className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.activeGramPanchayats}
            </div>
            <p className="text-xs text-muted-foreground">
              Active Gram Panchayats
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inactive</CardTitle>
            <MapPin className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {stats.inactiveGramPanchayats}
            </div>
            <p className="text-xs text-muted-foreground">
              Inactive Gram Panchayats
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">Across all GPs</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Applications</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalApplications}</div>
            <p className="text-xs text-muted-foreground">Total applications</p>
          </CardContent>
        </Card>
      </div>

      {/* Gram Panchayats Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Gram Panchayats</CardTitle>
          <CardDescription>
            Complete list of Gram Panchayats in the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search by name, district, state, or GP code..."
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>GP Name</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Statistics</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {gramPanchayats.length > 0 ? (
                  gramPanchayats.map((gp) => (
                    <TableRow key={gp.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{gp.name}</div>
                          {gp.sarpanchName && (
                            <div className="text-sm text-muted-foreground">
                              Sarpanch: {gp.sarpanchName}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {gp.code}
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{gp.district}</div>
                          <div className="text-sm text-muted-foreground">
                            {gp.state} • {gp.block}
                          </div>
                          {gp.pincode && (
                            <div className="text-sm text-muted-foreground">
                              PIN: {gp.pincode}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {gp.phoneNumber && (
                            <div className="flex items-center text-sm">
                              <Phone className="h-3 w-3 mr-1" />
                              {gp.phoneNumber}
                            </div>
                          )}
                          {gp.email && (
                            <div className="flex items-center text-sm">
                              <Mail className="h-3 w-3 mr-1" />
                              {gp.email}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center text-sm">
                            <Users className="h-3 w-3 mr-1" />
                            {gp._count.users} users
                          </div>
                          <div className="flex items-center text-sm">
                            <FileText className="h-3 w-3 mr-1" />
                            {gp._count.warishApplications} apps
                          </div>
                          <div className="flex items-center text-sm">
                            <Building className="h-3 w-3 mr-1" />
                            {gp._count.villages} villages
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={gp.isActive ? "default" : "destructive"}
                        >
                          {gp.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>{gp.createdAt.toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button size="sm" variant="outline" asChild>
                            <Link
                              href={`/super-admin/gram-panchayats/${gp.id}`}
                            >
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button size="sm" variant="outline" asChild>
                            <Link
                              href={`/super-admin/gram-panchayats/${gp.id}/edit`}
                            >
                              <Edit className="h-4 w-4" />
                            </Link>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      <div className="flex flex-col items-center space-y-2">
                        <MapPin className="h-8 w-8 text-muted-foreground" />
                        <p className="text-muted-foreground">
                          No Gram Panchayats found
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Start by adding a new Gram Panchayat
                        </p>
                        <Button asChild>
                          <Link href="/super-admin/gram-panchayats/new">
                            <Plus className="h-4 w-4 mr-2" />
                            Add Gram Panchayat
                          </Link>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
