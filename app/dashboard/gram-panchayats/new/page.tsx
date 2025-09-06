"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Textarea } from "@/components/ui/textarea"
import { Building, MapPin, Users, Phone, Mail } from "lucide-react"

export default function NewGramPanchayatPage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
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
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError("")
        setSuccess("")

        try {
            const response = await fetch("/api/gram-panchayat/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...formData,
                    population: formData.population ? parseInt(formData.population) : undefined,
                    area: formData.area ? parseFloat(formData.area) : undefined,
                }),
            })

            const data = await response.json()

            if (response.ok) {
                setSuccess("Gram Panchayat created successfully!")
                setTimeout(() => {
                    router.push("/super-admin/gram-panchayats")
                }, 2000)
            } else {
                const errorMessage = data.details
                    ? data.details.map((detail: any) => `${detail.path.join('.')}: ${detail.message}`).join(', ')
                    : data.error || "An error occurred during registration"
                setError(errorMessage)
            }
        } catch (error) {
            console.error("GP registration error:", error)
            setError("An error occurred during registration. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }))
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Register New Gram Panchayat</h1>
                <p className="text-muted-foreground">Add a new Gram Panchayat to the system</p>
            </div>

            <Card className="max-w-4xl">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Building className="h-5 w-5" />
                        Gram Panchayat Information
                    </CardTitle>
                    <CardDescription>
                        Enter the details of the Gram Panchayat to be registered
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <Alert variant="destructive">
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

                        {success && (
                            <Alert className="border-green-200 bg-green-50 text-green-800">
                                <AlertDescription>{success}</AlertDescription>
                            </Alert>
                        )}

                        {/* Basic Information */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold">Basic Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Gram Panchayat Name *</Label>
                                    <div className="relative">
                                        <Building className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="name"
                                            name="name"
                                            placeholder="Enter GP name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            required
                                            disabled={isLoading}
                                            className="pl-10"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="code">GP Code *</Label>
                                    <Input
                                        id="code"
                                        name="code"
                                        placeholder="Enter unique GP code"
                                        value={formData.code}
                                        onChange={handleInputChange}
                                        required
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Location Information */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold">Location Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="state">State *</Label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="state"
                                            name="state"
                                            placeholder="Enter state"
                                            value={formData.state}
                                            onChange={handleInputChange}
                                            required
                                            disabled={isLoading}
                                            className="pl-10"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="district">District *</Label>
                                    <Input
                                        id="district"
                                        name="district"
                                        placeholder="Enter district"
                                        value={formData.district}
                                        onChange={handleInputChange}
                                        required
                                        disabled={isLoading}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="block">Block *</Label>
                                    <Input
                                        id="block"
                                        name="block"
                                        placeholder="Enter block"
                                        value={formData.block}
                                        onChange={handleInputChange}
                                        required
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="pincode">Pincode</Label>
                                    <Input
                                        id="pincode"
                                        name="pincode"
                                        placeholder="Enter pincode"
                                        value={formData.pincode}
                                        onChange={handleInputChange}
                                        disabled={isLoading}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="address">Address</Label>
                                    <Textarea
                                        id="address"
                                        name="address"
                                        placeholder="Enter complete address"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        disabled={isLoading}
                                        rows={2}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Demographics */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold">Demographics</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="population">Population</Label>
                                    <div className="relative">
                                        <Users className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="population"
                                            name="population"
                                            type="number"
                                            placeholder="Enter population"
                                            value={formData.population}
                                            onChange={handleInputChange}
                                            disabled={isLoading}
                                            className="pl-10"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="area">Area (sq km)</Label>
                                    <Input
                                        id="area"
                                        name="area"
                                        type="number"
                                        step="0.01"
                                        placeholder="Enter area in sq km"
                                        value={formData.area}
                                        onChange={handleInputChange}
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Leadership */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold">Leadership</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="sarpanchName">Sarpanch Name</Label>
                                    <Input
                                        id="sarpanchName"
                                        name="sarpanchName"
                                        placeholder="Enter Sarpanch name"
                                        value={formData.sarpanchName}
                                        onChange={handleInputChange}
                                        disabled={isLoading}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="secretaryName">Secretary Name</Label>
                                    <Input
                                        id="secretaryName"
                                        name="secretaryName"
                                        placeholder="Enter Secretary name"
                                        value={formData.secretaryName}
                                        onChange={handleInputChange}
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Contact Information */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold">Contact Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="phoneNumber">Phone Number</Label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="phoneNumber"
                                            name="phoneNumber"
                                            type="tel"
                                            placeholder="Enter phone number"
                                            value={formData.phoneNumber}
                                            onChange={handleInputChange}
                                            disabled={isLoading}
                                            className="pl-10"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            placeholder="Enter email address"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            disabled={isLoading}
                                            className="pl-10"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4 pt-4">
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? "Creating..." : "Create Gram Panchayat"}
                            </Button>
                            <Button type="button" variant="outline" onClick={() => router.back()}>
                                Cancel
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
