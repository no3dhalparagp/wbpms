"use client";

import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type GramPanchayat = {
  id: string;
  name: string;
  code: string;
};

export default function NewWardPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [gramPanchayats, setGramPanchayats] = useState<GramPanchayat[]>([]);
  const [formData, setFormData] = useState({
    number: "",
    name: "",
    gramPanchayatId: "",
    population: "",
    area: "",
  });

  useEffect(() => {
    const fetchGps = async () => {
      try {
        const res = await fetch("/api/admin/gram-panchayats");
        if (res.ok) {
          const json = await res.json();
          setGramPanchayats(json.gramPanchayats || []);
        }
      } catch (e) {
        console.error("Failed to load Gram Panchayats", e);
      }
    };
    fetchGps();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = {
        number: formData.number ? Number(formData.number) : undefined,
        name: formData.name || undefined,
        gramPanchayatId: formData.gramPanchayatId,
        population: formData.population ? Number(formData.population) : undefined,
        area: formData.area ? Number(formData.area) : undefined,
      };
      const res = await fetch("/api/admin/wards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        router.push("/admin/gram-panchayats");
      } else {
        const err = await res.json().catch(() => ({}));
        alert(err.error || "Failed to create ward");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Add Ward</h1>
        <p className="text-muted-foreground">Create a new ward under a Gram Panchayat</p>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Ward Details</CardTitle>
          <CardDescription>Provide ward information</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="number">Ward Number</Label>
                <Input id="number" type="number" value={formData.number} onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, number: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Ward Name</Label>
                <Input id="name" value={formData.name} onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, name: e.target.value })} placeholder="Optional" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="gp">Gram Panchayat</Label>
              <Select value={formData.gramPanchayatId} onValueChange={(v) => setFormData({ ...formData, gramPanchayatId: v })}>
                <SelectTrigger id="gp">
                  <SelectValue placeholder="Select Gram Panchayat" />
                </SelectTrigger>
                <SelectContent>
                  {gramPanchayats.map((gp: GramPanchayat) => (
                    <SelectItem key={gp.id} value={gp.id}>
                      {gp.name} ({gp.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="population">Population</Label>
                <Input id="population" type="number" value={formData.population} onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, population: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="area">Area (sq km)</Label>
                <Input id="area" type="number" step="0.01" value={formData.area} onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, area: e.target.value })} />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Ward"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

