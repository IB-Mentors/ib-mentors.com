import { notFound } from "next/navigation";
import { CoursePage } from "@/components/courses/CoursePage";
import { getCourse, COURSES } from "@/content/courses";
import { JsonLd } from "@/components/measurement/JsonLd";
import { pageMetadata } from "@/lib/meta";

// Every entry is built ahead of time with its exact Framer slug; an unknown slug is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return COURSES.map((x) => ({ slug: x.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = getCourse(slug);
  if (!item) return {};
  return pageMetadata(`/courses/${slug}`, { title: item.title, kind: "course" });
}

export default async function Route({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!getCourse(slug)) notFound();
  return (
    <>
      <JsonLd path={`/courses/${slug}`} />
      <CoursePage slug={slug} />
    </>
  );
}
