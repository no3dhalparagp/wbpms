export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

import SystemSettingsCard from "@/components/super-admin/system-settings-card";

export default function SuperAdminSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">System Settings</h1>
        <p className="text-muted-foreground">Manage feature flags and menu visibility</p>
      </div>

      <SystemSettingsCard />
    </div>
  );
}

