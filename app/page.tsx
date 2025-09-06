import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Shield, Users, Settings } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold tracking-tight mb-4">Role-Based Access Control System</h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Secure authentication with Google OAuth and comprehensive role management for Staff, Admin, and Super Admin
            users.
          </p>
          <div className="flex gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/auth/signin">Sign In</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/auth/signup">Sign Up</Link>
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <Shield className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Secure Authentication</CardTitle>
              <CardDescription>
                Google OAuth integration with NextAuth.js for secure and reliable authentication.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Users className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Role Management</CardTitle>
              <CardDescription>
                Three-tier role system: Staff, Admin, and Super Admin with granular permissions.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Settings className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Admin Controls</CardTitle>
              <CardDescription>Comprehensive user management and system administration capabilities.</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  )
}
