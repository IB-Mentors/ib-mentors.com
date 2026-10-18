import { notFound } from "next/navigation";
import { BlogPostPage } from "@/components/blogs/BlogPostPage";
import { getPost, BLOG_POSTS } from "@/content/blogs";
import { JsonLd } from "@/components/measurement/JsonLd";
import { pageMetadata } from "@/lib/meta";

// Every entry is built ahead of time with its exact Framer slug; an unknown slug is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return BLOG_POSTS.map((x) => ({ slug: x.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = getPost(slug);
  if (!item) return {};
  return pageMetadata(`/blogs/${slug}`, { title: item.title, kind: "blog" });
}

export default async function Route({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!getPost(slug)) notFound();
  return (
    <>
      <JsonLd path={`/blogs/${slug}`} />
      <BlogPostPage slug={slug} />
    </>
  );
}
