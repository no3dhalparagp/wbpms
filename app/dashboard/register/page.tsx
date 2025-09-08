"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Eye, EyeOff, UserPlus, Mail, Lock, User, Phone, Building } from "lucide-react"

interface GramPanchayat {
    id: string
    name: string
    code: string
    district: string
    state: string
}

export default function AdminUserRegisterPage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const [gramPanchayats, setGramPanchayats] = useState<GramPanchayat[]>([])
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        phoneNumber: "",
        employeeId: "",
        designation: "",
        gramPanchayatId: "",
        role: "STAFF" as "STAFF" | "ADMIN",
    })

    // Fetch Gram Panchayats on component mount
    useEffect(() => {
        const fetchGramPanchayats = async () => {
            try {
                const response = await fetch("/api/admin/gram-panchayats")
                if (response.ok) {
                    const data = await response.json()
                    setGramPanchayats(data.gramPanchayats || [])
                }
            } catch (error) {
                console.error("Error fetching Gram Panchayats:", error)
            }
        }
        fetchGramPanchayats()
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError("")
        setSuccess("")

        // Basic validation
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match")
            setIsLoading(false)
            return
        }

        if (!formData.gramPanchayatId) {
            setError("Please select a Gram Panchayat")
            setIsLoading(false)
            return
        }

        try {
            const response = await fetch("/api/admin/users/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            })

            const data = await response.json()

            if (response.ok) {
                setSuccess("User created successfully!")
                // Reset form
                setFormData({
                    name: "",
                    email: "",
                    password: "",
                    confirmPassword: "",
                    phoneNumber: "",
                    employeeId: "",
                    designation: "",
                    gramPanchayatId: "",
                    role: "STAFF",
                })
                setTimeout(() => {
                    router.push("/admin/users")
                }, 2000)
            } else {
                const errorMessage = data.details
                    ? data.details.map((detail: any) => `${detail.path.join('.')}: ${detail.message}`).join(', ')
                    : data.error || "An error occurred during registration"
                setError(errorMessage)
            }
        } catch (error) {
            console.error("User registration error:", error)
            setError("An error occurred during registration. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }))
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Register New User</h1>
                <p className="text-muted-foreground">Add a new user to your Gram Panchayat</p>
            </div>

            <Card className="max-w-2xl">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <UserPlus className="h-5 w-5" />
                        User Information
                    </CardTitle>
                    <CardDescription>
                        Enter the details of the user to be registered
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
                                    <Label htmlFor="name">Full Name *</Label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="name"
                                            name="name"
                                            type="text"
                                            placeholder="Enter full name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            required
                                            disabled={isLoading}
                                            className="pl-10"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email">Email *</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            placeholder="Enter email address"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            required
                                            disabled={isLoading}
                                            className="pl-10"
                                        />
                                    </div>
                                </div>
                            </div>

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
                                    <Label htmlFor="employeeId">Employee ID</Label>
                                    <Input
                                        id="employeeId"
                                        name="employeeId"
                                        type="text"
                                        placeholder="Enter employee ID"
                                        value={formData.employeeId}
                                        onChange={handleInputChange}
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="designation">Designation</Label>
                                <Input
                                    id="designation"
                                    name="designation"
                                    type="text"
                                    placeholder="Enter job designation"
                                    value={formData.designation}
                                    onChange={handleInputChange}
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        {/* Role and GP Assignment */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold">Role & Assignment</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="role">Role *</Label>
                                    <Select
                                        value={formData.role}
                                        onValueChange={(value: "STAFF" | "ADMIN") =>
                                            setFormData(prev => ({ ...prev, role: value }))
                                        }
                                        disabled={isLoading}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select role" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="STAFF">Staff</SelectItem>
                                            <SelectItem value="ADMIN">Admin</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="gramPanchayatId">Gram Panchayat *</Label>
                                    <div className="relative">
                                        <Building className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Select
                                            value={formData.gramPanchayatId}
                                            onValueChange={(value) =>
                                                setFormData(prev => ({ ...prev, gramPanchayatId: value }))
                                            }
                                            disabled={isLoading}
                                        >
                                            <SelectTrigger className="pl-10">
                                                <SelectValue placeholder="Select Gram Panchayat" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {gramPanchayats.map((gp) => (
                                                    <SelectItem key={gp.id} value={gp.id}>
                                                        {gp.name} ({gp.code}) - {gp.district}, {gp.state}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Password */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold">Password</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="password">Password *</Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="password"
                                            name="password"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Create a password"
                                            value={formData.password}
                                            onChange={handleInputChange}
                                            required
                                            disabled={isLoading}
                                            className="pl-10 pr-10"
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                            onClick={() => setShowPassword(!showPassword)}
                                            disabled={isLoading}
                                        >
                                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </Button>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="confirmPassword">Confirm Password *</Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            type={showConfirmPassword ? "text" : "password"}
                                            placeholder="Confirm password"
                                            value={formData.confirmPassword}
                                            onChange={handleInputChange}
                                            required
                                            disabled={isLoading}
                                            className="pl-10 pr-10"
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            disabled={isLoading}
                                        >
                                            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4 pt-4">
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? "Creating User..." : "Create User"}
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
