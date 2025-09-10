export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

import { requireAdmin } from "@/lib/auth-utils";
import type React from "react";

type PageProps = {
  params: { slug?: string[] };
  searchParams: Record<string, string | string[] | undefined>;
};

export default async function AdminDynamicPage({ params }: PageProps) {
  await requireAdmin();

  const path = `/${["admin", ...(params.slug || [])].join("/")}`;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold tracking-tight">{params.slug?.[0] ? params.slug.join(" ") : "Admin"}</h1>
      <p className="text-sm text-muted-foreground">This page is scaffolded for: {path}</p>
      <div className="rounded-md border p-4 bg-muted/30">
        <p className="text-sm">Build your UI for this route here.</p>
      </div>
    </div>
  );
}

