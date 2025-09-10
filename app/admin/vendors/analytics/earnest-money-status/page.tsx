export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

import { requireAdmin } from "@/lib/auth-utils";

export default async function EarnestMoneyStatusPage() {
  await requireAdmin();
  return (
    <div className="space-y-2">
      <h1 className="text-2xl font-semibold">Earnest Money Status</h1>
      <p className="text-sm text-muted-foreground">EMD deposit and refund analytics.</p>
    </div>
  );
}

