import { Page } from "@/components/shell/Page";
import { getPost } from "@/content/blogs";

/**
 * STUB (blogs + forms builder fills this in). Route /blogs/<slug>. Framer module ps3eJN4x*.mjs (`Blogs`), `Go Back Button` (DsKqBh7hu*.mjs). Data: getPost(slug).
 * Sections, in order, each root carrying data-section="<Framer layer name>" for qa/compare.mjs:
 *   Hero Section / Details Section
 */
export function BlogPostPage({ slug }: { slug: string }) {
  void getPost(slug);
  return (
    <Page>
      <section data-section="Hero Section" />
      <section data-section="Details Section" />
    </Page>
  );
}
