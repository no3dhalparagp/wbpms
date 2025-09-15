"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { ArrowLeft, Save, MapPin, Building, Phone, Mail, Users } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

type Gp = {
  id: string;
  name: string;
  code: string;
  state: string;
  district: string;
  block: string;
  pincode?: string | null;
  address?: string | null;
  population?: number | null;
  area?: number | null;
  sarpanchName?: string | null;
  secretaryName?: string | null;
  phoneNumber?: string | null;
  email?: string | null;
  isActive: boolean;
  subscriptionLevel: "BASIC" | "STANDARD" | "PREMIUM" | "ENTERPRISE";
};

export default function EditGramPanchayatPage() {
  const router = useRouter();
  const params = useParams();
  const id = Array.isArray(params?.id) ? params?.id[0] : (params?.id as string);

  const [isLoading, setIsLoading] = useState(false);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    state: "",
    district: "",
    block: "",
    pincode: "",
    address: "",
    population: "",
    area: "",
    sarpanchName: "",
    secretaryName: "",
    phoneNumber: "",
    email: "",
    isActive: true,
    subscriptionLevel: "BASIC" as "BASIC" | "STANDARD" | "PREMIUM" | "ENTERPRISE",
  });

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`/api/gram-panchayats/${id}`);
        if (!res.ok) {
          toast.error("Failed to load Gram Panchayat");
          router.push("/super-admin/gram-panchayats");
          return;
        }
        const gp: Gp = await res.json();
        setFormData({
          name: gp.name || "",
          code: gp.code || "",
          state: gp.state || "",
          district: gp.district || "",
          block: gp.block || "",
          pincode: gp.pincode || "",
          address: gp.address || "",
          population: gp.population != null ? String(gp.population) : "",
          area: gp.area != null ? String(gp.area) : "",
          sarpanchName: gp.sarpanchName || "",
          secretaryName: gp.secretaryName || "",
          phoneNumber: gp.phoneNumber || "",
          email: gp.email || "",
          isActive: gp.isActive,
          subscriptionLevel: gp.subscriptionLevel || "BASIC",
        });
      } finally {
        setLoadingInitial(false);
      }
    };
    if (id) load();
  }, [id, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch(`/api/gram-panchayats/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          population: formData.population ? parseInt(formData.population) : null,
          area: formData.area ? parseFloat(formData.area) : null,
          subscriptionLevel: formData.subscriptionLevel,
        }),
      });
      if (res.ok) {
        toast.success("Gram Panchayat updated");
        router.push(`/super-admin/gram-panchayats/${id}`);
      } else {
        const err = await res.json().catch(() => ({}));
        toast.error(err.error || "Update failed");
      }
    } catch (err) {
      toast.error("Update failed");
    } finally {
      setIsLoading(false);
    }
  };

  if (loadingInitial) {
    return <div className="text-sm text-muted-foreground">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/super-admin/gram-panchayats/${id}`}>
              <ArrowLeft className="h-4 w-4 mr-2" /> Back to Details
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Edit Gram Panchayat</h1>
            <p className="text-muted-foreground">Update information for this Gram Panchayat</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center"><MapPin className="mr-2 h-5 w-5" /> Basic Information</CardTitle>
            <CardDescription>Essential details about the Gram Panchayat</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="name">Gram Panchayat Name *</Label>
                <Input id="name" value={formData.name} onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))} required />
              </div>
              <div>
                <Label htmlFor="code">GP Code *</Label>
                <Input id="code" value={formData.code} onChange={(e) => setFormData((p) => ({ ...p, code: e.target.value }))} required />
              </div>
              <div>
                <Label htmlFor="state">State *</Label>
                <Input id="state" value={formData.state} onChange={(e) => setFormData((p) => ({ ...p, state: e.target.value }))} required />
              </div>
              <div>
                <Label htmlFor="district">District *</Label>
                <Input id="district" value={formData.district} onChange={(e) => setFormData((p) => ({ ...p, district: e.target.value }))} required />
              </div>
              <div>
                <Label htmlFor="block">Block *</Label>
                <Input id="block" value={formData.block} onChange={(e) => setFormData((p) => ({ ...p, block: e.target.value }))} required />
              </div>
              <div>
                <Label htmlFor="pincode">Pincode</Label>
                <Input id="pincode" value={formData.pincode} onChange={(e) => setFormData((p) => ({ ...p, pincode: e.target.value }))} />
              </div>
            </div>
            <div>
              <Label htmlFor="address">Address</Label>
              <Textarea id="address" value={formData.address} onChange={(e) => setFormData((p) => ({ ...p, address: e.target.value }))} rows={3} />
            </div>
            <div className="flex items-center justify-between rounded-md border p-3">
              <div>
                <div className="text-sm font-medium">Active</div>
                <div className="text-xs text-muted-foreground">Enable or disable this Gram Panchayat</div>
              </div>
              <Switch checked={formData.isActive} onCheckedChange={(v) => setFormData((p) => ({ ...p, isActive: v }))} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center"><MapPin className="mr-2 h-5 w-5" /> Subscription</CardTitle>
            <CardDescription>Set subscription tier for access to features</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="subscriptionLevel">Subscription Level</Label>
              <Select
                value={formData.subscriptionLevel}
                onValueChange={(v) =>
                  setFormData((p) => ({
                    ...p,
                    subscriptionLevel: v as "BASIC" | "STANDARD" | "PREMIUM" | "ENTERPRISE",
                  }))
                }
              >
                <SelectTrigger id="subscriptionLevel">
                  <SelectValue placeholder="Select subscription" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BASIC">BASIC</SelectItem>
                  <SelectItem value="STANDARD">STANDARD</SelectItem>
                  <SelectItem value="PREMIUM">PREMIUM</SelectItem>
                  <SelectItem value="ENTERPRISE">ENTERPRISE</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center"><Users className="mr-2 h-5 w-5" /> Demographics</CardTitle>
            <CardDescription>Population and area information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="population">Population</Label>
                <Input id="population" type="number" value={formData.population} onChange={(e) => setFormData((p) => ({ ...p, population: e.target.value }))} />
              </div>
              <div>
                <Label htmlFor="area">Area (sq km)</Label>
                <Input id="area" type="number" step="0.01" value={formData.area} onChange={(e) => setFormData((p) => ({ ...p, area: e.target.value }))} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center"><Building className="mr-2 h-5 w-5" /> Leadership</CardTitle>
            <CardDescription>Information about key officials</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="sarpanchName">Sarpanch Name</Label>
                <Input id="sarpanchName" value={formData.sarpanchName} onChange={(e) => setFormData((p) => ({ ...p, sarpanchName: e.target.value }))} />
              </div>
              <div>
                <Label htmlFor="secretaryName">Secretary Name</Label>
                <Input id="secretaryName" value={formData.secretaryName} onChange={(e) => setFormData((p) => ({ ...p, secretaryName: e.target.value }))} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center"><Phone className="mr-2 h-5 w-5" /> Contact Information</CardTitle>
            <CardDescription>Phone and email contact details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input id="phoneNumber" value={formData.phoneNumber} onChange={(e) => setFormData((p) => ({ ...p, phoneNumber: e.target.value }))} />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={formData.email} onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))} />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" asChild disabled={isLoading}>
            <Link href={`/super-admin/gram-panchayats/${id}`}>Cancel</Link>
          </Button>
          <Button type="submit" disabled={isLoading} className="min-w-[120px]">
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Saving...
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

