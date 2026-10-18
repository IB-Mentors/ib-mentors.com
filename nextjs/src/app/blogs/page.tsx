import { BlogsPage } from "@/components/blogs/BlogsPage";
import { JsonLd } from "@/components/measurement/JsonLd";
import { pageMetadata } from "@/lib/meta";

export const metadata = pageMetadata("/blogs");

export default function Route() {
  return (
    <>
      <JsonLd path="/blogs" />
      <BlogsPage />
    </>
  );
}
