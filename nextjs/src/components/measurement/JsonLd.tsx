import { FAQ_ITEMS } from "@/components/faq/faqData";
import { seoEntry } from "@/lib/meta";
import { SITE_URL } from "@/lib/site";

// JSON-LD from the static mirror (scripts/inject-jsonld.py), snapshot in src/lib/seo-data.ts:
//   /  EducationalOrganization + WebSite;  /courses/<slug> Course + BreadcrumbList;  /blogs/<slug> BlogPosting +
//   BreadcrumbList;  /teams/<slug> Person + BreadcrumbList;  /courses, /blogs, /teams CollectionPage;
//   /contact ContactPage;  /become-mentor and /404 nothing, deliberately.
// Two additions on top of the snapshot, both rules the house already applies elsewhere:
//   - The organization node (/#organization, on /) names Kelin Studio as parentOrganization and Edward Zhang as
//     founder, the entity pair every Kelin product carries (Onehub, ChatFairy, Makan Box, GrooveSheet).
//   - /faq gets FAQPage. inject-jsonld.py emits it only when every answer is in the served HTML; Framer serves two of
//     eight, so the mirror has none. This page server-renders all eight (src/components/faq/faqData.ts), so the
//     mirror's own rule now passes.
// Page builders never add JSON-LD themselves.

const ORGANIZATION_EXTRA = {
  parentOrganization: {
    "@type": "Organization",
    "@id": "https://www.kelin.studio/#organization",
    name: "Kelin Studio",
    url: "https://www.kelin.studio/",
  },
  founder: {
    "@type": "Person",
    "@id": "https://www.edwardzehuazhang.com/#person",
    name: "Edward Zhang",
    url: "https://www.edwardzehuazhang.com/",
  },
};

type Node = Record<string, unknown>;

function withOrganizationExtra(block: unknown): unknown {
  const b = block as { "@graph"?: Node[] };
  if (!Array.isArray(b?.["@graph"])) return block;
  return {
    ...b,
    "@graph": b["@graph"].map((n) => (n["@id"] === `${SITE_URL}/#organization` ? { ...n, ...ORGANIZATION_EXTRA } : n)),
  };
}

function faqPage(): unknown {
  const e = seoEntry("/faq");
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "FAQPage",
        name: (e?.title ?? "よくあるご質問").split(" | ")[0],
        url: e?.canonical ?? `${SITE_URL}/faq`,
        inLanguage: "ja",
        isPartOf: { "@id": `${SITE_URL}/#website` },
        description: e?.description ?? undefined,
        publisher: { "@id": `${SITE_URL}/#organization` },
        mainEntity: FAQ_ITEMS.map(({ q, a }) => ({
          "@type": "Question",
          name: q,
          acceptedAnswer: { "@type": "Answer", text: a },
        })),
      },
    ],
  };
}

export function JsonLd({ path }: { path: string }) {
  const e = seoEntry(path);
  const blocks: unknown[] = (e?.jsonld ?? []).map(withOrganizationExtra);
  if (path === "/faq" && FAQ_ITEMS.length) blocks.push(faqPage());
  if (!blocks.length) return null;
  return (
    <>
      {blocks.map((b, i) => (
        <script
          key={i}
          type="application/ld+json"
          id={i === 0 ? "ibm-jsonld" : undefined}
          dangerouslySetInnerHTML={{ __html: JSON.stringify(b).replace(/</g, "\\u003c") }}
        />
      ))}
    </>
  );
}
