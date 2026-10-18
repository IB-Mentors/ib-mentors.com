import { ContactPage } from "@/components/contact/ContactPage";
import { JsonLd } from "@/components/measurement/JsonLd";
import { pageMetadata } from "@/lib/meta";

export const metadata = pageMetadata("/contact");

export default function Route() {
  return (
    <>
      <JsonLd path="/contact" />
      <ContactPage />
    </>
  );
}
