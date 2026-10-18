import { FaqPage } from "@/components/faq/FaqPage";
import { JsonLd } from "@/components/measurement/JsonLd";
import { pageMetadata } from "@/lib/meta";

export const metadata = pageMetadata("/faq");

export default function Route() {
  return (
    <>
      <JsonLd path="/faq" />
      <FaqPage />
    </>
  );
}
