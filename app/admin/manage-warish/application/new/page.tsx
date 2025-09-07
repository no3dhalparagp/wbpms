"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  User,
  Calendar,
  MapPin
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

interface FamilyMember {
  id: string;
  name: string;
  gender: string;
  relation: string;
  livingStatus: string;
  maritalStatus: string;
  husbandName?: string;
}

export default function NewWarishApplicationPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  
  const [formData, setFormData] = useState({
    reportingDate: new Date().toISOString().split('T')[0],
    acknowlegment: '',
    applicantName: '',
    applicantMobileNumber: '',
    relationwithdeceased: '',
    nameOfDeceased: '',
    dateOfDeath: '',
    gender: '',
    maritialStatus: '',
    fatherName: '',
    spouseName: '',
    villageName: '',
    postOffice: ''
  });

  const addFamilyMember = () => {
    const newMember: FamilyMember = {
      id: Date.now().toString(),
      name: '',
      gender: '',
      relation: '',
      livingStatus: 'alive',
      maritalStatus: '',
      husbandName: ''
    };
    setFamilyMembers([...familyMembers, newMember]);
  };

  const removeFamilyMember = (id: string) => {
    setFamilyMembers(familyMembers.filter(member => member.id !== id));
  };

  const updateFamilyMember = (id: string, field: keyof FamilyMember, value: string) => {
    setFamilyMembers(familyMembers.map(member => 
      member.id === id ? { ...member, [field]: value } : member
    ));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/warish', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          familyMembers
        }),
      });

      if (response.ok) {
        toast.success("Warish application created successfully");
        router.push('/admin/manage-warish/application');
      } else {
        const error = await response.json();
        toast.error(error.message || "Failed to create application");
      }
    } catch (error) {
      console.error("Error creating application:", error);
      toast.error("Failed to create application");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/admin/manage-warish/application">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Applications
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">New Warish Application</h1>
            <p className="text-muted-foreground">
              Create a new Warish application
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="mr-2 h-5 w-5" />
              Basic Information
            </CardTitle>
            <CardDescription>
              Applicant and deceased person details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="reportingDate">Reporting Date</Label>
                <Input
                  id="reportingDate"
                  type="date"
                  value={formData.reportingDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, reportingDate: e.target.value }))}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="acknowlegment">Acknowledgment Number</Label>
                <Input
                  id="acknowlegment"
                  value={formData.acknowlegment}
                  onChange={(e) => setFormData(prev => ({ ...prev, acknowlegment: e.target.value }))}
                  placeholder="Enter acknowledgment number"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="applicantName">Applicant Name</Label>
                <Input
                  id="applicantName"
                  value={formData.applicantName}
                  onChange={(e) => setFormData(prev => ({ ...prev, applicantName: e.target.value }))}
                  placeholder="Enter applicant name"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="applicantMobileNumber">Mobile Number</Label>
                <Input
                  id="applicantMobileNumber"
                  value={formData.applicantMobileNumber}
                  onChange={(e) => setFormData(prev => ({ ...prev, applicantMobileNumber: e.target.value }))}
                  placeholder="Enter mobile number"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="relationwithdeceased">Relation with Deceased</Label>
                <Input
                  id="relationwithdeceased"
                  value={formData.relationwithdeceased}
                  onChange={(e) => setFormData(prev => ({ ...prev, relationwithdeceased: e.target.value }))}
                  placeholder="e.g., Son, Daughter, Wife, etc."
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="nameOfDeceased">Name of Deceased</Label>
                <Input
                  id="nameOfDeceased"
                  value={formData.nameOfDeceased}
                  onChange={(e) => setFormData(prev => ({ ...prev, nameOfDeceased: e.target.value }))}
                  placeholder="Enter deceased person's name"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="dateOfDeath">Date of Death</Label>
                <Input
                  id="dateOfDeath"
                  type="date"
                  value={formData.dateOfDeath}
                  onChange={(e) => setFormData(prev => ({ ...prev, dateOfDeath: e.target.value }))}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="gender">Gender</Label>
                <Select value={formData.gender} onValueChange={(value) => setFormData(prev => ({ ...prev, gender: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="maritialStatus">Marital Status</Label>
                <Select value={formData.maritialStatus} onValueChange={(value) => setFormData(prev => ({ ...prev, maritialStatus: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select marital status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="married">Married</SelectItem>
                    <SelectItem value="unmarried">Unmarried</SelectItem>
                    <SelectItem value="divorced">Divorced</SelectItem>
                    <SelectItem value="widowed">Widowed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="fatherName">Father's Name</Label>
                <Input
                  id="fatherName"
                  value={formData.fatherName}
                  onChange={(e) => setFormData(prev => ({ ...prev, fatherName: e.target.value }))}
                  placeholder="Enter father's name"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="spouseName">Spouse's Name</Label>
                <Input
                  id="spouseName"
                  value={formData.spouseName}
                  onChange={(e) => setFormData(prev => ({ ...prev, spouseName: e.target.value }))}
                  placeholder="Enter spouse's name (if applicable)"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Location Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MapPin className="mr-2 h-5 w-5" />
              Location Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="villageName">Village Name</Label>
                <Input
                  id="villageName"
                  value={formData.villageName}
                  onChange={(e) => setFormData(prev => ({ ...prev, villageName: e.target.value }))}
                  placeholder="Enter village name"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="postOffice">Post Office</Label>
                <Input
                  id="postOffice"
                  value={formData.postOffice}
                  onChange={(e) => setFormData(prev => ({ ...prev, postOffice: e.target.value }))}
                  placeholder="Enter post office"
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Family Members */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center">
                <User className="mr-2 h-5 w-5" />
                Family Members
              </span>
              <Button type="button" onClick={addFamilyMember} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Member
              </Button>
            </CardTitle>
            <CardDescription>
              Add family members to the Warish application
            </CardDescription>
          </CardHeader>
          <CardContent>
            {familyMembers.length > 0 ? (
              <div className="space-y-4">
                {familyMembers.map((member, index) => (
                  <div key={member.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium">Family Member #{index + 1}</h4>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeFamilyMember(member.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <Label>Name</Label>
                        <Input
                          value={member.name}
                          onChange={(e) => updateFamilyMember(member.id, 'name', e.target.value)}
                          placeholder="Enter name"
                        />
                      </div>
                      
                      <div>
                        <Label>Gender</Label>
                        <Select value={member.gender} onValueChange={(value) => updateFamilyMember(member.id, 'gender', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label>Relation</Label>
                        <Select value={member.relation} onValueChange={(value) => updateFamilyMember(member.id, 'relation', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select relation" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Son">Son</SelectItem>
                            <SelectItem value="Daughter">Daughter</SelectItem>
                            <SelectItem value="Father">Father</SelectItem>
                            <SelectItem value="Mother">Mother</SelectItem>
                            <SelectItem value="Brother">Brother</SelectItem>
                            <SelectItem value="Sister">Sister</SelectItem>
                            <SelectItem value="Wife">Wife</SelectItem>
                            <SelectItem value="Husband">Husband</SelectItem>
                            <SelectItem value="Grandfather">Grandfather</SelectItem>
                            <SelectItem value="Grandmother">Grandmother</SelectItem>
                            <SelectItem value="Grandson">Grandson</SelectItem>
                            <SelectItem value="Granddaughter">Granddaughter</SelectItem>
                            <SelectItem value="Uncle">Uncle</SelectItem>
                            <SelectItem value="Aunt">Aunt</SelectItem>
                            <SelectItem value="Nephew">Nephew</SelectItem>
                            <SelectItem value="Niece">Niece</SelectItem>
                            <SelectItem value="Cousin">Cousin</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label>Living Status</Label>
                        <Select value={member.livingStatus} onValueChange={(value) => updateFamilyMember(member.id, 'livingStatus', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="alive">Alive</SelectItem>
                            <SelectItem value="dead">Dead</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label>Marital Status</Label>
                        <Select value={member.maritalStatus} onValueChange={(value) => updateFamilyMember(member.id, 'maritalStatus', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select marital status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="married">Married</SelectItem>
                            <SelectItem value="unmarried">Unmarried</SelectItem>
                            <SelectItem value="divorced">Divorced</SelectItem>
                            <SelectItem value="widowed">Widowed</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      {member.maritalStatus === 'married' && (
                        <div>
                          <Label>Husband's Name</Label>
                          <Input
                            value={member.husbandName || ''}
                            onChange={(e) => updateFamilyMember(member.id, 'husbandName', e.target.value)}
                            placeholder="Enter husband's name"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <User className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">No family members added yet</p>
                <p className="text-sm text-muted-foreground">
                  Click "Add Member" to add family members to this application
                </p>
              </div>
            )}
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
            <Link href="/admin/manage-warish/application">
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
                Creating...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Create Application
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
