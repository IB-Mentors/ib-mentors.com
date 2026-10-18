import { notFound } from "next/navigation";
import { MentorPage } from "@/components/teams/MentorPage";
import { getMentor, MENTORS } from "@/content/teams";
import { JsonLd } from "@/components/measurement/JsonLd";
import { pageMetadata } from "@/lib/meta";

// Every entry is built ahead of time with its exact Framer slug; an unknown slug is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return MENTORS.map((x) => ({ slug: x.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = getMentor(slug);
  if (!item) return {};
  return pageMetadata(`/teams/${slug}`, { title: item.name, kind: "page" });
}

export default async function Route({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!getMentor(slug)) notFound();
  return (
    <>
      <JsonLd path={`/teams/${slug}`} />
      <MentorPage slug={slug} />
    </>
  );
}
