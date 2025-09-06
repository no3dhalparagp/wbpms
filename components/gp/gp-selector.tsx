"use client"

import { useState, useEffect } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

interface GramPanchayat {
  id: string
  name: string
  code: string
  district: string
  state: string
}

interface GPSelectorProps {
  value?: string
  onValueChange: (value: string) => void
  placeholder?: string
  label?: string
  required?: boolean
}

export function GPSelector({
  value,
  onValueChange,
  placeholder = "Select Gram Panchayat",
  label = "Gram Panchayat",
  required = false,
}: GPSelectorProps) {
  const [gramPanchayats, setGramPanchayats] = useState<GramPanchayat[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchGPs() {
      try {
        const response = await fetch("/api/gram-panchayats")
        if (response.ok) {
          const data = await response.json()
          setGramPanchayats(data)
        }
      } catch (error) {
        console.error("Failed to fetch Gram Panchayats:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchGPs()
  }, [])

  return (
    <div className="space-y-2">
      <Label htmlFor="gp-selector">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <Select value={value} onValueChange={onValueChange} disabled={loading}>
        <SelectTrigger id="gp-selector">
          <SelectValue placeholder={loading ? "Loading..." : placeholder} />
        </SelectTrigger>
        <SelectContent>
          {gramPanchayats.map((gp) => (
            <SelectItem key={gp.id} value={gp.id}>
              <div className="flex flex-col">
                <span className="font-medium">{gp.name}</span>
                <span className="text-sm text-muted-foreground">
                  {gp.code} • {gp.district}, {gp.state}
                </span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
