import { BecomeMentorPage } from "@/components/become-mentor/BecomeMentorPage";
import { JsonLd } from "@/components/measurement/JsonLd";
import { pageMetadata } from "@/lib/meta";

export const metadata = pageMetadata("/become-mentor");

export default function Route() {
  return (
    <>
      <JsonLd path="/become-mentor" />
      <BecomeMentorPage />
    </>
  );
}
