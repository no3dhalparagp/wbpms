"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { MapPin, Loader2 } from "lucide-react";

interface LocationChangeDialogProps {
  userId: string;
  currentLocation: string | null;
  onLocationChange: (gramPanchayatId: string) => Promise<void>;
  gramPanchayats: Array<{
    id: string;
    name: string;
    district: string;
    state: string;
  }>;
}

export function LocationChangeDialog({
  userId,
  currentLocation,
  onLocationChange,
  gramPanchayats,
}: LocationChangeDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<string>("");

  const handleSubmit = async () => {
    if (!selectedLocation) return;

    setIsLoading(true);
    try {
      await onLocationChange(selectedLocation);
      setIsOpen(false);
    } catch (error) {
      console.error("Failed to change location:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="h-8">
          <MapPin className="mr-2 h-4 w-4" />
          Change Location
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change User Location</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Select value={selectedLocation} onValueChange={setSelectedLocation}>
            <SelectTrigger>
              <SelectValue placeholder="Select location" />
            </SelectTrigger>
            <SelectContent>
              {gramPanchayats.map((gp) => (
                <SelectItem key={gp.id} value={gp.id}>
                  {gp.name} ({gp.district}, {gp.state})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            onClick={handleSubmit}
            disabled={!selectedLocation || isLoading}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              "Update Location"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
