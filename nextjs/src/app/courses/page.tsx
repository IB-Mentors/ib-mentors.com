import { CoursesPage } from "@/components/courses/CoursesPage";
import { JsonLd } from "@/components/measurement/JsonLd";
import { pageMetadata } from "@/lib/meta";

export const metadata = pageMetadata("/courses");

export default function Route() {
  return (
    <>
      <JsonLd path="/courses" />
      <CoursesPage />
    </>
  );
}
