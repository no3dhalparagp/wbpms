// A lightweight client to interact with emBridge/EmSigner local service for DSC signing
// Tries common localhost endpoints. Adjust base URL via EM_BRIDGE_BASE_URL if needed.

export type EmBridgeSignOptions = {
  reason?: string;
  location?: string;
  contactInfo?: string;
  tsaUrl?: string;
};

export type EmBridgeSignResult = {
  ok: boolean;
  signedPdfBase64?: string;
  error?: string;
};

const defaultCandidates = [
  "http://127.0.0.1:12090",
  "http://localhost:12090",
  "http://127.0.0.1:1585",
  "https://127.0.0.1:12090",
];

function getBaseCandidates(): string[] {
  const override = typeof window !== "undefined"
    ? ((window as any).EM_BRIDGE_BASE_URL || (window as any).NEXT_PUBLIC_EM_BRIDGE_BASE_URL)
    : undefined;
  return override ? [override] : defaultCandidates;
}

export async function signPdfWithEmBridge(pdfBase64: string, opts: EmBridgeSignOptions = {}): Promise<EmBridgeSignResult> {
  try {
    const baseCandidates = getBaseCandidates();

    // Common emBridge-compatible payload. Some vendors accept fields like 'file', 'reason', etc.
    const payload: Record<string, any> = {
      file: pdfBase64,
      reason: opts.reason || "Document approved",
      location: opts.location || "Dhalpara GP",
      contactInfo: opts.contactInfo || "info@dhalparagp.in",
    };
    if (opts.tsaUrl) payload.tsaUrl = opts.tsaUrl;

    // Try known endpoints
    const endpoints = [
      "sign",
      "api/sign",
      "dsc/sign",
      "emsigner/sign",
    ];

    for (const baseUrl of baseCandidates) {
      // Optional health check; even if it fails, still try sign endpoints
      try { await fetch(`${baseUrl}/health`, { method: "GET" }); } catch (_) {}
      for (const ep of endpoints) {
        try {
          const res = await fetch(`${baseUrl}/${ep}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
          if (!res.ok) continue;
          const data = await res.json().catch(() => ({} as any));
          const signed = data.signedFile || data.signedPdf || data.file || data.base64 || data.data;
          if (typeof signed === "string" && signed.length > 0) {
            return { ok: true, signedPdfBase64: signed };
          }
        } catch (_) {
          // try next base/endpoint
        }
      }
    }

    return { ok: false, error: "emBridge did not return a signed file" };
  } catch (error: any) {
    return { ok: false, error: error?.message || "Unknown error while signing" };
  }
}

