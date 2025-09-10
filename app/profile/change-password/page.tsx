"use client";

import { useState, type FormEvent, type ChangeEvent } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { KeyRound, Save } from "lucide-react";
import { toast } from "sonner";

export default function ChangePasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({ password: "", newpassword: "", confirm: "" });

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (form.newpassword !== form.confirm) {
      toast.error("New password and confirmation do not match");
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch("/api/user/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: form.password, newpassword: form.newpassword }),
      });
      if (res.ok) {
        toast.success("Password updated");
        setForm({ password: "", newpassword: "", confirm: "" });
      } else {
        const { error } = await res.json();
        const message = typeof error === "string" ? error : "Failed to change password";
        toast.error(message);
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-xl">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center"><KeyRound className="h-5 w-5 mr-2" />Change Password</CardTitle>
          <CardDescription>Update your account password</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <Label htmlFor="current">Current Password</Label>
              <Input id="current" type="password" value={form.password} onChange={(e: ChangeEvent<HTMLInputElement>) => setForm({ ...form, password: e.target.value })} required />
            </div>
            <div>
              <Label htmlFor="new">New Password</Label>
              <Input id="new" type="password" value={form.newpassword} onChange={(e: ChangeEvent<HTMLInputElement>) => setForm({ ...form, newpassword: e.target.value })} required />
            </div>
            <div>
              <Label htmlFor="confirm">Confirm New Password</Label>
              <Input id="confirm" type="password" value={form.confirm} onChange={(e: ChangeEvent<HTMLInputElement>) => setForm({ ...form, confirm: e.target.value })} required />
            </div>
            <div className="flex justify-end">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Update Password
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

