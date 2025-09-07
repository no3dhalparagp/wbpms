"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  ArrowLeft,
  Save,
  MapPin,
  Building,
  Phone,
  Mail,
  Users
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function NewGramPanchayatPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    state: '',
    district: '',
    block: '',
    pincode: '',
    address: '',
    population: '',
    area: '',
    sarpanchName: '',
    secretaryName: '',
    phoneNumber: '',
    email: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/gram-panchayats', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          population: formData.population ? parseInt(formData.population) : null,
          area: formData.area ? parseFloat(formData.area) : null
        }),
      });

      if (response.ok) {
        toast.success("Gram Panchayat created successfully");
        router.push('/super-admin/gram-panchayats');
      } else {
        const error = await response.json();
        toast.error(error.message || "Failed to create Gram Panchayat");
      }
    } catch (error) {
      console.error("Error creating Gram Panchayat:", error);
      toast.error("Failed to create Gram Panchayat");
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
            <Link href="/super-admin/gram-panchayats">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Gram Panchayats
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">New Gram Panchayat</h1>
            <p className="text-muted-foreground">
              Add a new Gram Panchayat to the system
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MapPin className="mr-2 h-5 w-5" />
              Basic Information
            </CardTitle>
            <CardDescription>
              Essential details about the Gram Panchayat
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="name">Gram Panchayat Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter Gram Panchayat name"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="code">GP Code *</Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value }))}
                  placeholder="Enter unique GP code"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="state">State *</Label>
                <Input
                  id="state"
                  value={formData.state}
                  onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
                  placeholder="Enter state name"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="district">District *</Label>
                <Input
                  id="district"
                  value={formData.district}
                  onChange={(e) => setFormData(prev => ({ ...prev, district: e.target.value }))}
                  placeholder="Enter district name"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="block">Block *</Label>
                <Input
                  id="block"
                  value={formData.block}
                  onChange={(e) => setFormData(prev => ({ ...prev, block: e.target.value }))}
                  placeholder="Enter block name"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="pincode">Pincode</Label>
                <Input
                  id="pincode"
                  value={formData.pincode}
                  onChange={(e) => setFormData(prev => ({ ...prev, pincode: e.target.value }))}
                  placeholder="Enter pincode"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                placeholder="Enter complete address"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Demographics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="mr-2 h-5 w-5" />
              Demographics
            </CardTitle>
            <CardDescription>
              Population and area information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="population">Population</Label>
                <Input
                  id="population"
                  type="number"
                  value={formData.population}
                  onChange={(e) => setFormData(prev => ({ ...prev, population: e.target.value }))}
                  placeholder="Enter population"
                />
              </div>
              
              <div>
                <Label htmlFor="area">Area (sq km)</Label>
                <Input
                  id="area"
                  type="number"
                  step="0.01"
                  value={formData.area}
                  onChange={(e) => setFormData(prev => ({ ...prev, area: e.target.value }))}
                  placeholder="Enter area in square kilometers"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Leadership */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Building className="mr-2 h-5 w-5" />
              Leadership
            </CardTitle>
            <CardDescription>
              Information about key officials
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="sarpanchName">Sarpanch Name</Label>
                <Input
                  id="sarpanchName"
                  value={formData.sarpanchName}
                  onChange={(e) => setFormData(prev => ({ ...prev, sarpanchName: e.target.value }))}
                  placeholder="Enter Sarpanch name"
                />
              </div>
              
              <div>
                <Label htmlFor="secretaryName">Secretary Name</Label>
                <Input
                  id="secretaryName"
                  value={formData.secretaryName}
                  onChange={(e) => setFormData(prev => ({ ...prev, secretaryName: e.target.value }))}
                  placeholder="Enter Secretary name"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Phone className="mr-2 h-5 w-5" />
              Contact Information
            </CardTitle>
            <CardDescription>
              Phone and email contact details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                  placeholder="Enter phone number"
                />
              </div>
              
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="Enter email address"
                />
              </div>
            </div>
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
            <Link href="/super-admin/gram-panchayats">
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
                Create Gram Panchayat
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}