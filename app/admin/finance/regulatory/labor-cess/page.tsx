export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

import { requireAdmin } from "@/lib/auth-utils";

export default async function LaborCessPage() {
  await requireAdmin();
  return (
    <div className="space-y-2">
      <h1 className="text-2xl font-semibold">Labor Cess</h1>
      <p className="text-sm text-muted-foreground">Calculate and remit labor welfare cess.</p>
    </div>
  );
}

