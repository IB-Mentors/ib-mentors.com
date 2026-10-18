import { seoEntry } from "@/lib/meta";

// JSON-LD from the static mirror (scripts/inject-jsonld.py), snapshot in src/lib/seo-data.ts:
//   /  EducationalOrganization + WebSite;  /courses/<slug> Course + BreadcrumbList;  /blogs/<slug> BlogPosting +
//   BreadcrumbList;  /teams/<slug> Person + BreadcrumbList;  /courses, /blogs, /teams CollectionPage;
//   /contact ContactPage;  /faq nothing until every answer is server-rendered (see the mirror README);
//   /become-mentor and /404 nothing, deliberately.
// FAQPage: ours server-renders all 8 answers, so the lead can emit it once the FAQ builder exports the Q&A as
// FAQ_ITEMS from src/components/faq/faqData.ts. Builders never add JSON-LD themselves.
export function JsonLd({ path }: { path: string }) {
  const e = seoEntry(path);
  if (!e?.jsonld.length) return null;
  return (
    <>
      {e.jsonld.map((b, i) => (
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
