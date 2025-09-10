export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

import { requireAdmin } from "@/lib/auth-utils";

export default async function PaymentRecordsPage() {
  await requireAdmin();
  return (
    <div className="space-y-2">
      <h1 className="text-2xl font-semibold">Payment Records</h1>
      <p className="text-sm text-muted-foreground">Payments and disbursement history.</p>
    </div>
  );
}

