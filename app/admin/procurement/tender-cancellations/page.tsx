export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

import { requireAdmin } from "@/lib/auth-utils";

export default async function TenderCancellationsPage() {
  await requireAdmin();
  return (
    <div className="space-y-2">
      <h1 className="text-2xl font-semibold">Tender Cancellations</h1>
      <p className="text-sm text-muted-foreground">Cancelled tenders and reasons.</p>
    </div>
  );
}

