"use client";

import useSWR from "swr";
import { Switch } from "@/components/ui/switch";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { useCallback, useState } from "react";

export default function SystemSettingsCard() {
  const { data, mutate, isLoading } = useSWR<{ settings: Record<string, boolean> }>(
    "/api/system-settings",
    (url: string) => fetch(url).then((r) => r.json())
  );
  const settings = (data?.settings as Record<string, boolean>) || {};
  const [saving, setSaving] = useState(false);

  const updateSetting = useCallback(async (key: string, value: boolean) => {
    setSaving(true);
    try {
      const res = await fetch("/api/system-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [key]: value }),
      });
      if (res.ok) {
        await mutate();
      }
    } finally {
      setSaving(false);
    }
  }, [mutate]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>System Settings</CardTitle>
        <CardDescription>Feature controls managed by Super Admin</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Gram Panchayat menu</p>
            <p className="text-xs text-muted-foreground">Show GP-related menu items across roles</p>
          </div>
          <Switch
            checked={settings["feature.gpMenu.enabled"] ?? true}
            disabled={isLoading || saving}
            onCheckedChange={(v: boolean) => updateSetting("feature.gpMenu.enabled", v)}
          />
        </div>
      </CardContent>
    </Card>
  );
}

