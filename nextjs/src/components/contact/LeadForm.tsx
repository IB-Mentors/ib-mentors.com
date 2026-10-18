"use client";
/**
 * The Framer forms of /faq ("Contact Section"), /contact and /become-mentor, one module.
 *
 * Markup follows Framer's FormContainer: a grid of <label>s ("Info Wrapper"), each with a w4t77b caption and an
 * "Input & Icon" box (Framer's form-text-input / form-select wrappers, icon absolutely placed at left 24px), then the
 * "Form Button". Framer's eleven hidden honeypot inputs are kept (position absolute, scale 0).
 *
 * Behaviour: native required / type validation; one submission posts JSON to /api/contact
 *   { form, page, fields: { <Framer field name>: value }, honeypot, attribution: attributionParams(), referrer }
 * pending -> button "Loading"; 2xx -> "Success" and trackConversion("generate_lead", { form, page }); anything else
 * (503 when no delivery is configured, 4xx, network error) -> "Error". A form that reached Success ignores further
 * submits; from Error the visitor can submit again (a lead is worth a retry), and the button shows Loading again.
 */
import { useState, type FormEvent } from "react";
import { attributionParams, trackConversion } from "@/lib/measurement";
import { FormButton, type FormState } from "./FormButton";
import s from "./LeadForm.module.css";

export type LeadFormId = "faq" | "contact" | "become-mentor";

export type Field =
  | {
      kind: "text" | "email" | "number" | "textarea";
      /** Framer's input name, verbatim ("Email " keeps its trailing space). */
      name: string;
      label: string;
      placeholder: string;
      /** width/height are the SVG's pixel size (the box is min(width, 16) x 13, as Framer sizes it). Icon placement, per Framer page: centred (top 49%, translateY(-50%)), the /faq email and message offsets, or 24px from the top. */
      icon: { src: string; width: number; height: number; pos: "center" | "faqEmail" | "faqMessage" | "top24" };
      labelName?: string;
    }
  | { kind: "select"; name: string; label: string; options: string[]; labelName?: string };

const HONEYPOTS = ["website", "company", "message", "subject", "title", "description", "feedback", "notes", "details", "remarks", "comments"];

export function LeadForm({
  form,
  fields,
  buttonTitle,
  buttonVariant,
  className,
}: {
  form: LeadFormId;
  fields: Field[];
  buttonTitle: string;
  buttonVariant?: { desktop: "Default" | "Phone"; tablet?: "Default" | "Phone"; phone?: "Default" | "Phone" };
  /** Page-specific layout of the <form> (Framer's per-page class). */
  className?: string;
}) {
  const [state, setState] = useState<FormState>("incomplete");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (state === "pending" || state === "success") return;
    const el = e.currentTarget;
    const data: Record<string, string> = {};
    // Two become-mentor selects share Framer's name "Location": keep both answers.
    el.querySelectorAll<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>("[data-field]").forEach((input) => {
      const v = input.value;
      data[input.name] = data[input.name] ? `${data[input.name]}, ${v}` : v;
    });
    const honeypot = HONEYPOTS.map((n) => (el.elements.namedItem(n) as HTMLInputElement | null)?.value ?? "")
      .filter(Boolean)
      .join(" ");
    const page = window.location.pathname;
    setState("pending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ form, page, fields: data, honeypot, attribution: attributionParams(), referrer: document.referrer }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setState("success");
      trackConversion("generate_lead", { form, page });
    } catch {
      setState("error");
    }
  }

  return (
    <form className={`${s.form}${className ? ` ${className}` : ""}`} data-v={form} onSubmit={onSubmit}>
      <div className={s.info} data-framer-name="Info Wrapper">
        {fields.map((f, i) => (
          <label key={i} className={s.label}>
            <div className={s.caption} data-framer-name={f.labelName}>
              <p className={`p-w4t77b ${s.captionText}`}>{f.label}</p>
            </div>
            {f.kind === "select" ? (
              <div className={`${s.wrapper} ${s.selectWrapper}`}>
                <select name={f.name} required className={s.input} data-field defaultValue="">
                  <option value="" disabled>
                    Select…
                  </option>
                  {f.options.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div className={s.inputIcon} data-framer-name="Input & Icon">
                <div className={`${s.icon} ${s[f.icon.pos]}`} style={{ width: Math.min(f.icon.width, 16) }} data-framer-name="Icon">
                  <img className={s.iconImg} src={f.icon.src} alt="Icon" width={f.icon.width} height={f.icon.height} />
                </div>
                {f.kind === "textarea" ? (
                  <div className={`${s.wrapper} ${s.textInput} ${s.textarea}`}>
                    <textarea required name={f.name} placeholder={f.placeholder} className={s.input} data-field />
                  </div>
                ) : (
                  <div className={`${s.wrapper} ${s.textInput}`}>
                    <input type={f.kind} required name={f.name} placeholder={f.placeholder} className={s.input} data-field />
                  </div>
                )}
              </div>
            )}
          </label>
        ))}
      </div>
      <div className={s.button}>
        <FormButton title={buttonTitle} state={state} variant={buttonVariant} />
      </div>
      {HONEYPOTS.map((n) => (
        <input
          key={n}
          type="text"
          name={n}
          tabIndex={-1}
          autoComplete="one-time-code"
          aria-hidden="true"
          style={{ position: "absolute", transform: "scale(0)" }}
          data-1p-ignore="true"
          data-lpignore="true"
          data-form-type="other"
          data-bwignore="true"
          defaultValue=""
        />
      ))}
    </form>
  );
}
