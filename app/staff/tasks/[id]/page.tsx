import { requireStaff } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  ArrowLeft,
  User,
  Phone,
  Calendar,
  MapPin,
  FileText,
  Users,
  Edit,
  CheckCircle,
  XCircle
} from "lucide-react";
import { auth } from "@/auth";
import Link from "next/link";
import { notFound } from "next/navigation";

interface TaskDetailPageProps {
  params: {
    id: string;
  };
}

async function getTaskDetails(taskId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return null;
  }

  const task = await prisma.warishApplication.findFirst({
    where: { 
      id: taskId,
      assingstaffId: session.user.id 
    },
    include: {
      gramPanchayat: {
        select: { name: true, district: true, state: true, address: true }
      },
      warishDetails: {
        orderBy: { createdAt: 'asc' }
      },
      WarishDocument: {
        select: {
          id: true,
          documentType: true,
          cloudinaryUrl: true,
          verified: true,
          remarks: true
        }
      }
    }
  });

  return task;
}

export default async function TaskDetailPage({ params }: TaskDetailPageProps) {
  await requireStaff();
  const task = await getTaskDetails(params.id);

  if (!task) {
    notFound();
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

  const getGenderColor = (gender: string) => {
    switch (gender) {
      case 'male':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'female':
        return 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getMaritalStatusColor = (status: string) => {
    switch (status) {
      case 'married':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'unmarried':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'widowed':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'divorced':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/staff/tasks">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Tasks
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Task Details</h1>
            <p className="text-muted-foreground">
              Warish Application: {task.acknowlegment}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge className={getStatusColor(task.warishApplicationStatus)}>
            {task.warishApplicationStatus}
          </Badge>
          {['submitted', 'pending', 'process'].includes(task.warishApplicationStatus) && (
            <Button asChild>
              <Link href={`/staff/tasks/${task.id}/process`}>
                <Edit className="h-4 w-4 mr-2" />
                Process Application
              </Link>
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Application Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="mr-2 h-5 w-5" />
              Application Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              <div>
                <Label className="text-sm font-medium">Acknowledgment Number</Label>
                <p className="text-sm text-muted-foreground">{task.acknowlegment}</p>
              </div>
              
              <div>
                <Label className="text-sm font-medium">Reporting Date</Label>
                <p className="text-sm text-muted-foreground">
                  {task.reportingDate.toLocaleDateString()}
                </p>
              </div>

              <div>
                <Label className="text-sm font-medium">Applicant Name</Label>
                <p className="text-sm text-muted-foreground">{task.applicantName}</p>
              </div>

              <div>
                <Label className="text-sm font-medium">Mobile Number</Label>
                <p className="text-sm text-muted-foreground">{task.applicantMobileNumber}</p>
              </div>

              <div>
                <Label className="text-sm font-medium">Relation with Deceased</Label>
                <p className="text-sm text-muted-foreground">{task.relationwithdeceased}</p>
              </div>

              <div>
                <Label className="text-sm font-medium">Name of Deceased</Label>
                <p className="text-sm text-muted-foreground">{task.nameOfDeceased}</p>
              </div>

              <div>
                <Label className="text-sm font-medium">Date of Death</Label>
                <p className="text-sm text-muted-foreground">
                  {task.dateOfDeath.toLocaleDateString()}
                </p>
              </div>

              <div>
                <Label className="text-sm font-medium">Gender</Label>
                <Badge className={getGenderColor(task.gender)}>
                  {task.gender}
                </Badge>
              </div>

              <div>
                <Label className="text-sm font-medium">Marital Status</Label>
                <Badge className={getMaritalStatusColor(task.maritialStatus)}>
                  {task.maritialStatus}
                </Badge>
              </div>

              <div>
                <Label className="text-sm font-medium">Father's Name</Label>
                <p className="text-sm text-muted-foreground">{task.fatherName}</p>
              </div>

              {task.spouseName && (
                <div>
                  <Label className="text-sm font-medium">Spouse's Name</Label>
                  <p className="text-sm text-muted-foreground">{task.spouseName}</p>
                </div>
              )}

              <div>
                <Label className="text-sm font-medium">Village Name</Label>
                <p className="text-sm text-muted-foreground">{task.villageName}</p>
              </div>

              <div>
                <Label className="text-sm font-medium">Post Office</Label>
                <p className="text-sm text-muted-foreground">{task.postOffice}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Gram Panchayat Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MapPin className="mr-2 h-5 w-5" />
              Gram Panchayat Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm font-medium">Gram Panchayat Name</Label>
              <p className="text-sm text-muted-foreground">{task.gramPanchayat.name}</p>
            </div>
            
            <div>
              <Label className="text-sm font-medium">District</Label>
              <p className="text-sm text-muted-foreground">{task.gramPanchayat.district}</p>
            </div>
            
            <div>
              <Label className="text-sm font-medium">State</Label>
              <p className="text-sm text-muted-foreground">{task.gramPanchayat.state}</p>
            </div>
            
            {task.gramPanchayat.address && (
              <div>
                <Label className="text-sm font-medium">Address</Label>
                <p className="text-sm text-muted-foreground">{task.gramPanchayat.address}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Family Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="mr-2 h-5 w-5" />
            Family Details
          </CardTitle>
          <CardDescription>
            Information about family members in the Warish application
          </CardDescription>
        </CardHeader>
        <CardContent>
          {task.warishDetails.length > 0 ? (
            <div className="space-y-4">
              {task.warishDetails.map((detail, index) => (
                <div key={detail.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium">Family Member #{index + 1}</h4>
                    <div className="flex space-x-2">
                      <Badge className={getGenderColor(detail.gender)}>
                        {detail.gender}
                      </Badge>
                      <Badge className={getMaritalStatusColor(detail.maritialStatus)}>
                        {detail.maritialStatus}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="grid gap-3 md:grid-cols-2">
                    <div>
                      <Label className="text-sm font-medium">Name</Label>
                      <p className="text-sm text-muted-foreground">{detail.name}</p>
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium">Relation</Label>
                      <p className="text-sm text-muted-foreground">{detail.relation}</p>
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium">Living Status</Label>
                      <Badge variant={detail.livingStatus === 'alive' ? 'default' : 'destructive'}>
                        {detail.livingStatus}
                      </Badge>
                    </div>
                    
                    {detail.hasbandName && (
                      <div>
                        <Label className="text-sm font-medium">Husband's Name</Label>
                        <p className="text-sm text-muted-foreground">{detail.hasbandName}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No family details available</p>
          )}
        </CardContent>
      </Card>

      {/* Documents */}
      {task.WarishDocument.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Uploaded Documents</CardTitle>
            <CardDescription>
              Documents submitted with this application
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {task.WarishDocument.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{doc.documentType}</p>
                      {doc.remarks && (
                        <p className="text-sm text-muted-foreground">{doc.remarks}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={doc.verified ? 'default' : 'outline'}>
                      {doc.verified ? 'Verified' : 'Pending'}
                    </Badge>
                    <Button size="sm" variant="outline" asChild>
                      <a href={doc.cloudinaryUrl} target="_blank" rel="noopener noreferrer">
                        View
                      </a>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Field Report Remarks */}
      {task.fieldreportRemark && (
        <Card>
          <CardHeader>
            <CardTitle>Field Report Remarks</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{task.fieldreportRemark}</p>
          </CardContent>
        </Card>
      )}

      {/* Admin Notes */}
      {task.adminNoteRemark && (
        <Card>
          <CardHeader>
            <CardTitle>Admin Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{task.adminNoteRemark}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
