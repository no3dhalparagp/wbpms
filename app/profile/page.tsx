"use client";

import { useState, useEffect, type FormEvent } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  User as UserIcon,
  MapPin,
  Building,
  Save,
  Shield
} from "lucide-react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

interface UserProfile {
  id: string;
  name: string | null;
  email: string;
  role: string;
  designation: string | null;
  employeeId: string | null;
  phoneNumber: string | null;
  aadharNumber: string | null;
  joiningDate: string | null;
  gramPanchayat: {
    name: string;
    district: string;
    state: string;
  } | null;
}

export default function ProfilePage() {
  const { data: session, update } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    designation: "",
    employeeId: "",
    phoneNumber: "",
    aadharNumber: "",
  });

  useEffect(() => {
    if (session?.user) {
      setProfile({
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        role: session.user.role,
        designation: (session.user as any).designation || null,
        employeeId: (session.user as any).employeeId || null,
        phoneNumber: (session.user as any).phoneNumber || null,
        aadharNumber: (session.user as any).aadharNumber || null,
        joiningDate: (session.user as any).joiningDate || null,
        gramPanchayat: (session.user as any).gramPanchayat || null,
      });

      setFormData({
        name: session.user.name || "",
        designation: (session.user as any).designation || "",
        employeeId: (session.user as any).employeeId || "",
        phoneNumber: (session.user as any).phoneNumber || "",
        aadharNumber: (session.user as any).aadharNumber || "",
      });
    }
  }, [session]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success("Profile updated successfully");
        setIsEditing(false);
        await update();
      } else {
        const error = await response.json();
        toast.error(error.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "SUPER_ADMIN":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "ADMIN":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "STAFF":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  if (!profile) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
          <p className="text-muted-foreground">Loading profile information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
        <p className="text-muted-foreground">Manage your personal information and account settings</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center"><UserIcon className="mr-2 h-5 w-5" />Profile Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserIcon className="h-10 w-10 text-primary" />
              </div>
              <h3 className="font-semibold text-lg">{profile.name || "No name"}</h3>
              <p className="text-muted-foreground">{profile.email}</p>
              <Badge className={getRoleColor(profile.role)}>
                {profile.role.replace("_", " ")}
              </Badge>
            </div>

            {profile.designation && (
              <div className="pt-4 border-t">
                <div className="flex items-center space-x-2">
                  <Building className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{profile.designation}</span>
                </div>
              </div>
            )}

            {profile.gramPanchayat && (
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <div className="text-sm">
                  <div>{profile.gramPanchayat.name}</div>
                  <div className="text-muted-foreground">
                    {profile.gramPanchayat.district}, {profile.gramPanchayat.state}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center"><Shield className="mr-2 h-5 w-5" />Personal Information</span>
              <Button variant={isEditing ? "outline" : "default"} size="sm" onClick={() => setIsEditing(!isEditing)}>
                {isEditing ? "Cancel" : "Edit"}
              </Button>
            </CardTitle>
            <CardDescription>Update your personal details and contact information</CardDescription>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" value={formData.name} onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))} placeholder="Enter your full name" />
                  </div>
                  <div>
                    <Label htmlFor="designation">Designation</Label>
                    <Input id="designation" value={formData.designation} onChange={(e) => setFormData((prev) => ({ ...prev, designation: e.target.value }))} placeholder="Enter your designation" />
                  </div>
                  <div>
                    <Label htmlFor="employeeId">Employee ID</Label>
                    <Input id="employeeId" value={formData.employeeId} onChange={(e) => setFormData((prev) => ({ ...prev, employeeId: e.target.value }))} placeholder="Enter employee ID" />
                  </div>
                  <div>
                    <Label htmlFor="phoneNumber">Phone Number</Label>
                    <Input id="phoneNumber" value={formData.phoneNumber} onChange={(e) => setFormData((prev) => ({ ...prev, phoneNumber: e.target.value }))} placeholder="Enter phone number" />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="aadharNumber">Aadhar Number</Label>
                    <Input id="aadharNumber" value={formData.aadharNumber} onChange={(e) => setFormData((prev) => ({ ...prev, aadharNumber: e.target.value }))} placeholder="Enter Aadhar number" />
                  </div>
                </div>
                <div className="flex justify-end space-x-4">
                  <Button type="button" variant="outline" onClick={() => setIsEditing(false)} disabled={isLoading}>Cancel</Button>
                  <Button type="submit" disabled={isLoading}>{isLoading ? (<><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>Saving...</>) : (<><Save className="h-4 w-4 mr-2" />Save Changes</>)}</Button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label className="text-sm font-medium">Full Name</Label>
                    <p className="text-sm text-muted-foreground">{profile.name || "Not provided"}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Email</Label>
                    <p className="text-sm text-muted-foreground">{profile.email}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Designation</Label>
                    <p className="text-sm text-muted-foreground">{profile.designation || "Not provided"}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Employee ID</Label>
                    <p className="text-sm text-muted-foreground">{profile.employeeId || "Not provided"}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Phone Number</Label>
                    <p className="text-sm text-muted-foreground">{profile.phoneNumber || "Not provided"}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Aadhar Number</Label>
                    <p className="text-sm text-muted-foreground">{profile.aadharNumber ? `${profile.aadharNumber.slice(0, 4)}****${profile.aadharNumber.slice(-4)}` : "Not provided"}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Joining Date</Label>
                    <p className="text-sm text-muted-foreground">{profile.joiningDate ? new Date(profile.joiningDate).toLocaleDateString() : "Not provided"}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Role</Label>
                    <Badge className={getRoleColor(profile.role)}>
                      {profile.role.replace("_", " ")}
                    </Badge>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

