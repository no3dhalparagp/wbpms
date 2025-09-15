import { requireStaff } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  MapPin,
  Users,
  Phone,
  Mail,
  Calendar,
  Building,
  FileText,
  User
} from "lucide-react";
import { auth } from "@/auth";

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

async function getStaffInfo() {
  const session = await auth();
  if (!session?.user?.id) {
    return null;
  }

  const staff = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      name: true,
      email: true,
      designation: true,
      employeeId: true,
      createdAt: true,
      gramPanchayat: {
        select: { name: true, district: true, state: true }
      }
    }
  });

  return staff;
}

export default async function StaffGramPanchayatPage() {
  await requireStaff();
  const gramPanchayat = await getGramPanchayatInfo();
  const staff = await getStaffInfo();

  if (!gramPanchayat || !staff) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gram Panchayat Information</h1>
          <p className="text-muted-foreground">
            Unable to load Gram Panchayat information.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Gram Panchayat Information</h1>
        <p className="text-muted-foreground">
          Information about {gramPanchayat.name}
        </p>
      </div>

      {/* Staff Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <User className="mr-2 h-5 w-5" />
            Your Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h4 className="font-medium">Name</h4>
              <p className="text-muted-foreground">{staff.name || 'Not provided'}</p>
            </div>
            
            <div>
              <h4 className="font-medium">Email</h4>
              <p className="text-muted-foreground">{staff.email}</p>
            </div>
            
            <div>
              <h4 className="font-medium">Designation</h4>
              <p className="text-muted-foreground">{staff.designation || 'Not provided'}</p>
            </div>
            
            <div>
              <h4 className="font-medium">Employee ID</h4>
              <p className="text-muted-foreground">{staff.employeeId || 'Not provided'}</p>
            </div>
            
            <div>
              <h4 className="font-medium">Joined Date</h4>
              <p className="text-muted-foreground">
                {staff.createdAt.toLocaleDateString()}
              </p>
            </div>
            
            <div>
              <h4 className="font-medium">Assigned Gram Panchayat</h4>
              <p className="text-muted-foreground">
                {staff.gramPanchayat.name}, {staff.gramPanchayat.district}, {staff.gramPanchayat.state}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MapPin className="mr-2 h-5 w-5" />
            Gram Panchayat Details
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
                <p className="text-muted-foreground font-mono">{gramPanchayat.code}</p>
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