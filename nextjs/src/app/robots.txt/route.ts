import { SITE_URL } from "@/lib/site";

export const dynamic = "force-static";

// Same as the robots.txt the static mirror serves. Preview deployments (SITE_NOINDEX=1) disallow everything.
export function GET() {
  const body =
    process.env.SITE_NOINDEX === "1"
      ? "User-agent: *\nDisallow: /\n"
      : `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml`;
  return new Response(body, { headers: { "Content-Type": "text/plain" } });
}
