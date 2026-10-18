// Delivery for the site's forms (/contact, /faq "Contact Section", /become-mentor). The Framer site posts to
// Framer's own form service; the Next.js site delivers submissions itself, configured by env:
//   RESEND_API_KEY + LEADS_TO (+ LEADS_FROM)  -> emailed to the team through Resend
//   LEADS_WEBHOOK_URL + LEADS_WEBHOOK_SECRET  -> optional: POSTed as JSON to a leads portal first
// If neither is set the endpoint answers 503, so the form shows its error state instead of silently dropping a lead.
export type LeadForm = "contact" | "faq" | "become-mentor";
export type Lead = {
  form: LeadForm;
  page: string;
  fields: Record<string, string>;
  /** The ad click the visitor arrived on (attributionParams() in src/lib/measurement.ts). */
  attribution?: Record<string, string>;
  referrer?: string;
  userAgent?: string;
};

const MAX = 5000;

export function clean(v: unknown): string {
  return typeof v === "string" ? v.trim().slice(0, MAX) : typeof v === "number" ? String(v) : "";
}

export function isEmail(v: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) && v.length <= 254;
}

/** The non-field context a form posted, read safely from the request. */
export function leadMeta(req: Request, body: Record<string, unknown> | null): Pick<Lead, "attribution" | "referrer" | "userAgent"> {
  const raw = body?.attribution;
  const attribution: Record<string, string> = {};
  if (raw && typeof raw === "object") {
    for (const [k, v] of Object.entries(raw as Record<string, unknown>).slice(0, 30)) {
      if (/^[a-z_]{1,40}$/.test(k) && (typeof v === "string" || typeof v === "number")) attribution[k] = String(v).slice(0, 300);
    }
  }
  return { attribution, referrer: clean(body?.referrer).slice(0, 500), userAgent: (req.headers.get("user-agent") ?? "").slice(0, 400) };
}

function escape(s: string): string {
  return s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);
}

const SUBJECT: Record<LeadForm, string> = {
  contact: "お問い合わせ",
  faq: "お問い合わせ（FAQページ）",
  "become-mentor": "メンター応募",
};

export async function deliverLead(lead: Lead): Promise<{ ok: boolean; status: number }> {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.LEADS_TO;
  const hook = process.env.LEADS_WEBHOOK_URL;
  const hookSecret = process.env.LEADS_WEBHOOK_SECRET;
  if (!(key && to) && !(hook && hookSecret)) return { ok: false, status: 503 };

  if (hook && hookSecret) {
    const r = await fetch(hook, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${hookSecret}` },
      body: JSON.stringify({ site: "ib-mentors.com", ...lead, submittedAt: new Date().toISOString() }),
      signal: AbortSignal.timeout(20000),
    }).catch(() => null);
    if (r?.ok) return { ok: true, status: 200 };
    console.error(`leads: webhook failed (${r ? r.status : "no response"})`);
  }

  if (key && to) {
    const rows: [string, string][] = Object.entries(lead.fields);
    rows.push(["page", lead.page]);
    if (lead.attribution && Object.keys(lead.attribution).length) {
      rows.push(["ad click", Object.entries(lead.attribution).map(([k, v]) => `${k}=${v}`).join(", ")]);
    }
    const who = lead.fields.Name || lead.fields.Email || "";
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.LEADS_FROM || "IBメンター website <website@mail.kelin.studio>",
        to: to.split(",").map((s) => s.trim()),
        reply_to: lead.fields.Email && isEmail(lead.fields.Email) ? lead.fields.Email : undefined,
        subject: `${SUBJECT[lead.form]}: ${who}`,
        html: `<table cellpadding="6">${rows.map(([k, v]) => `<tr><td><b>${escape(k)}</b></td><td>${escape(v).replace(/\n/g, "<br>")}</td></tr>`).join("")}</table>`,
      }),
      signal: AbortSignal.timeout(15000),
    }).catch(() => null);
    if (r?.ok) return { ok: true, status: 200 };
  }
  return { ok: false, status: 502 };
}
