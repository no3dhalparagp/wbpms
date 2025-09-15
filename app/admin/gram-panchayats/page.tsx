import { requireAdmin } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  MapPin,
  Users,
  Phone,
  Mail,
  Calendar,
  Building,
  FileText,
  Edit
} from "lucide-react";
import { auth } from "@/auth";
import Link from "next/link";

async function getGramPanchayatInfo() {
  const session = await auth();
  if (!session?.user?.gramPanchayatId) {
    return null;
  }

  const gramPanchayat = await prisma.gramPanchayat.findUnique({
    where: { id: session.user.gramPanchayatId },
    include: {
      _count: {
        select: {
          users: true,
          villages: true,
          wards: true,
          warishApplications: true
        }
      }
    }
  });

  return gramPanchayat;
}

async function getRecentApplications() {
  const session = await auth();
  if (!session?.user?.gramPanchayatId) {
    return [];
  }

  const recentApplications = await prisma.warishApplication.findMany({
    where: { gramPanchayatId: session.user.gramPanchayatId },
    take: 5,
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      acknowlegment: true,
      applicantName: true,
      warishApplicationStatus: true,
      createdAt: true
    }
  });

  return recentApplications;
}

export default async function AdminGramPanchayatPage() {
  await requireAdmin();
  const gramPanchayat = await getGramPanchayatInfo();
  const recentApplications = await getRecentApplications();

  if (!gramPanchayat) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gram Panchayat Information</h1>
          <p className="text-muted-foreground">
            You need to be assigned to a Gram Panchayat to view this information.
          </p>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'pending':
      case 'submitted':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'process':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Gram Panchayat Information</h1>
        <p className="text-muted-foreground">
          Details and statistics for {gramPanchayat.name}
        </p>
      </div>

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MapPin className="mr-2 h-5 w-5" />
            Basic Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div>
                <h4 className="font-medium">Gram Panchayat Name</h4>
                <p className="text-muted-foreground">{gramPanchayat.name}</p>
              </div>
              
              <div>
                <h4 className="font-medium">GP Code</h4>
                <p className="text-muted-foreground">{gramPanchayat.code}</p>
              </div>
              
              <div>
                <h4 className="font-medium">State</h4>
                <p className="text-muted-foreground">{gramPanchayat.state}</p>
              </div>
              
              <div>
                <h4 className="font-medium">District</h4>
                <p className="text-muted-foreground">{gramPanchayat.district}</p>
              </div>
              
              <div>
                <h4 className="font-medium">Block</h4>
                <p className="text-muted-foreground">{gramPanchayat.block}</p>
              </div>
            </div>
            
            <div className="space-y-4">
              {gramPanchayat.pincode && (
                <div>
                  <h4 className="font-medium">Pincode</h4>
                  <p className="text-muted-foreground">{gramPanchayat.pincode}</p>
                </div>
              )}
              
              {gramPanchayat.population && (
                <div>
                  <h4 className="font-medium">Population</h4>
                  <p className="text-muted-foreground">{gramPanchayat.population.toLocaleString()}</p>
                </div>
              )}
              
              {gramPanchayat.area && (
                <div>
                  <h4 className="font-medium">Area</h4>
                  <p className="text-muted-foreground">{gramPanchayat.area} sq km</p>
                </div>
              )}
              
              <div>
                <h4 className="font-medium">Status</h4>
                <Badge variant={gramPanchayat.isActive ? "default" : "destructive"}>
                  {gramPanchayat.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
            </div>
          </div>
          
          {gramPanchayat.address && (
            <div className="mt-6">
              <h4 className="font-medium">Address</h4>
              <p className="text-muted-foreground">{gramPanchayat.address}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Leadership Information */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Building className="mr-2 h-5 w-5" />
              Leadership
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {gramPanchayat.sarpanchName && (
              <div>
                <h4 className="font-medium">Sarpanch Name</h4>
                <p className="text-muted-foreground">{gramPanchayat.sarpanchName}</p>
              </div>
            )}
            
            {gramPanchayat.secretaryName && (
              <div>
                <h4 className="font-medium">Secretary Name</h4>
                <p className="text-muted-foreground">{gramPanchayat.secretaryName}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Phone className="mr-2 h-5 w-5" />
              Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {gramPanchayat.phoneNumber && (
              <div>
                <h4 className="font-medium">Phone Number</h4>
                <p className="text-muted-foreground">{gramPanchayat.phoneNumber}</p>
              </div>
            )}
            
            {gramPanchayat.email && (
              <div>
                <h4 className="font-medium">Email</h4>
                <p className="text-muted-foreground">{gramPanchayat.email}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{gramPanchayat._count.users}</div>
            <p className="text-xs text-muted-foreground">
              Registered users
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Applications</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{gramPanchayat._count.warishApplications}</div>
            <p className="text-xs text-muted-foreground">
              Warish applications
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Villages</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{gramPanchayat._count.villages}</div>
            <p className="text-xs text-muted-foreground">
              Villages under GP
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Wards</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{gramPanchayat._count.wards}</div>
            <p className="text-xs text-muted-foreground">
              Administrative wards
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Applications */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Applications</CardTitle>
          <CardDescription>
            Latest Warish applications from this Gram Panchayat
          </CardDescription>
        </CardHeader>
        <CardContent>
          {recentApplications.length > 0 ? (
            <div className="space-y-4">
              {recentApplications.map((app) => (
                <div key={app.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="space-y-1">
                    <p className="font-medium">{app.applicantName}</p>
                    <p className="text-sm text-muted-foreground">
                      Acknowledgment: {app.acknowlegment}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Submitted: {app.createdAt.toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getStatusColor(app.warishApplicationStatus)}>
                      {app.warishApplicationStatus}
                    </Badge>
                    <Button size="sm" variant="outline" asChild>
                      <Link href={`/admin/manage-warish/application/${app.id}`}>
                        <Edit className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No applications found</p>
          )}
        </CardContent>
      </Card>

      {/* System Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="mr-2 h-5 w-5" />
            System Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h4 className="font-medium">Created Date</h4>
              <p className="text-muted-foreground">
                {gramPanchayat.createdAt.toLocaleDateString()}
              </p>
            </div>
            
            <div>
              <h4 className="font-medium">Last Updated</h4>
              <p className="text-muted-foreground">
                {gramPanchayat.updatedAt.toLocaleDateString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}