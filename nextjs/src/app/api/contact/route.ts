import { NextResponse } from "next/server";
import { clean, deliverLead, isEmail, leadMeta, type LeadForm } from "@/lib/leads";

// One endpoint for every form on the site. Body (JSON):
//   { form: "contact" | "faq" | "become-mentor", page: "/contact",
//     fields: { Name, "Email ", Message, "Phone number", Location, ... }   <- Framer's own field names
//     attribution?: attributionParams(), referrer?: document.referrer }
// Framer's honeypot inputs (comments, company, website, ...) must be posted as `honeypot` (any non-empty value
// silently drops the submission with a 200, as Framer does). 200 = delivered; 400 = invalid; 503 = no delivery
// configured (see src/lib/leads.ts); 502 = delivery failed.
const FORMS: LeadForm[] = ["contact", "faq", "become-mentor"];

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  if (clean(body.honeypot)) return NextResponse.json({ ok: true });
  const form = FORMS.includes(body.form as LeadForm) ? (body.form as LeadForm) : "contact";
  const raw = (body.fields && typeof body.fields === "object" ? body.fields : {}) as Record<string, unknown>;
  const fields: Record<string, string> = {};
  for (const [k, v] of Object.entries(raw).slice(0, 20)) {
    const key = clean(k).slice(0, 60);
    const val = clean(v);
    if (key && val) fields[key] = val;
  }
  // Framer names the email field "Email " (trailing space); accept either spelling.
  const email = fields["Email"] ?? fields["Email "] ?? "";
  if (fields["Email "] !== undefined) {
    fields.Email = fields["Email "];
    delete fields["Email "];
  }
  if (!fields.Name || !isEmail(email)) return NextResponse.json({ error: "Name and a valid email are required" }, { status: 400 });
  const r = await deliverLead({ form, page: clean(body.page) || "/", fields, ...leadMeta(req, body) });
  return NextResponse.json(r.ok ? { ok: true } : { error: "Could not send" }, { status: r.status });
}
