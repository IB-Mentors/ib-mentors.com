import type { Metadata } from "next";
import { NotFoundPage } from "@/components/not-found/NotFoundPage";
import { pageMetadata } from "@/lib/meta";

// Any URL no route matches (and notFound() from a detail route): Framer's styled 404, noindex like the mirror's.
export const metadata: Metadata = pageMetadata("/404");

export default function NotFound() {
  return <NotFoundPage />;
}
