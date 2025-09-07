"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { 
  ArrowLeft,
  Save,
  CheckCircle,
  XCircle,
  AlertCircle
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

interface ProcessTaskPageProps {
  params: {
    id: string;
  };
}

export default function ProcessTaskPage({ params }: ProcessTaskPageProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    status: 'process',
    remarks: '',
    warishRefNo: '',
    warishRefDate: '',
    approvalYear: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`/api/warish/${params.id}/process`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success("Application processed successfully");
        router.push(`/staff/tasks/${params.id}`);
      } else {
        const error = await response.json();
        toast.error(error.message || "Failed to process application");
      }
    } catch (error) {
      console.error("Error processing application:", error);
      toast.error("Failed to process application");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = (status: string) => {
    setFormData(prev => ({ ...prev, status }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/staff/tasks/${params.id}`}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Details
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Process Application</h1>
            <p className="text-muted-foreground">
              Review and process Warish application
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Status Decision */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertCircle className="mr-2 h-5 w-5" />
                Application Status
              </CardTitle>
              <CardDescription>
                Select the appropriate status for this application
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup 
                value={formData.status} 
                onValueChange={handleStatusChange}
                className="space-y-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="process" id="process" />
                  <Label htmlFor="process" className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                    <span>Under Process</span>
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="approved" id="approved" />
                  <Label htmlFor="approved" className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Approve Application</span>
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="rejected" id="rejected" />
                  <Label htmlFor="rejected" className="flex items-center space-x-2">
                    <XCircle className="h-4 w-4 text-red-600" />
                    <span>Reject Application</span>
                  </Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Reference Information */}
          {formData.status === 'approved' && (
            <Card>
              <CardHeader>
                <CardTitle>Reference Information</CardTitle>
                <CardDescription>
                  Provide reference details for approved applications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="warishRefNo">Warish Reference Number</Label>
                  <input
                    id="warishRefNo"
                    type="text"
                    value={formData.warishRefNo}
                    onChange={(e) => setFormData(prev => ({ ...prev, warishRefNo: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter reference number"
                  />
                </div>
                
                <div>
                  <Label htmlFor="warishRefDate">Reference Date</Label>
                  <input
                    id="warishRefDate"
                    type="date"
                    value={formData.warishRefDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, warishRefDate: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <Label htmlFor="approvalYear">Approval Year</Label>
                  <input
                    id="approvalYear"
                    type="text"
                    value={formData.approvalYear}
                    onChange={(e) => setFormData(prev => ({ ...prev, approvalYear: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., 2024"
                  />
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Remarks */}
        <Card>
          <CardHeader>
            <CardTitle>Field Report Remarks</CardTitle>
            <CardDescription>
              Provide detailed remarks about your field investigation and findings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              value={formData.remarks}
              onChange={(e) => setFormData(prev => ({ ...prev, remarks: e.target.value }))}
              placeholder="Enter your field investigation findings, observations, and recommendations..."
              className="min-h-[120px]"
            />
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4">
          <Button 
            type="button" 
            variant="outline" 
            asChild
            disabled={isLoading}
          >
            <Link href={`/staff/tasks/${params.id}`}>
              Cancel
            </Link>
          </Button>
          
          <Button 
            type="submit" 
            disabled={isLoading}
            className="min-w-[120px]"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Processing...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
