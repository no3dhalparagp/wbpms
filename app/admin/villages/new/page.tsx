"use client";

import { useState, useEffect, type ChangeEvent, type FormEvent } from "react";
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

export default function NewVillagePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [gramPanchayats, setGramPanchayats] = useState<GramPanchayat[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    code: "",
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
        name: formData.name,
        code: formData.code || undefined,
        gramPanchayatId: formData.gramPanchayatId,
        population: formData.population ? Number(formData.population) : undefined,
        area: formData.area ? Number(formData.area) : undefined,
      };
      const res = await fetch("/api/admin/villages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        router.push("/admin/gram-panchayats");
      } else {
        const err = await res.json().catch(() => ({}));
        alert(err.error || "Failed to create village");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Add Village</h1>
        <p className="text-muted-foreground">Create a new village under a Gram Panchayat</p>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Village Details</CardTitle>
          <CardDescription>Provide village information</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={formData.name} onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, name: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="code">Code</Label>
              <Input id="code" value={formData.code} onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, code: e.target.value })} placeholder="Optional" />
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
                {isSubmitting ? "Saving..." : "Save Village"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

