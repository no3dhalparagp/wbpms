export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

import { requireAdmin } from "@/lib/auth-utils";

export default async function ContractAdministrationPage() {
  await requireAdmin();
  return (
    <div className="space-y-2">
      <h1 className="text-2xl font-semibold">Contract Administration</h1>
      <p className="text-sm text-muted-foreground">Manage post-award contract activities.</p>
    </div>
  );
}

