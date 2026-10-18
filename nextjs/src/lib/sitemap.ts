import { BLOG_POSTS } from "@/content/blogs";
import { COURSES } from "@/content/courses";
import { MENTORS } from "@/content/teams";
import { SITE_URL } from "./site";

// Same shape and order as the sitemap Framer publishes (flat pages, mentors, courses, posts; no lastmod),
// built from the content modules so a new CMS entry is listed by adding it there. /404 is not listed.
const FLAT = ["/", "/teams", "/courses", "/blogs", "/faq", "/contact", "/become-mentor"];

export function sitemapXml(): string {
  const paths = [
    ...FLAT,
    ...MENTORS.map((m) => `/teams/${m.slug}`),
    ...COURSES.map((c) => `/courses/${c.slug}`),
    ...BLOG_POSTS.map((p) => `/blogs/${p.slug}`),
  ];
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${paths
    .map((p) => `<url><loc>${SITE_URL}${p}</loc></url>`)
    .join("\n")}\n</urlset>`;
}
