import { HomePage } from "@/components/home/HomePage";
import { JsonLd } from "@/components/measurement/JsonLd";
import { pageMetadata } from "@/lib/meta";

export const metadata = pageMetadata("/");

export default function Route() {
  return (
    <>
      <JsonLd path="/" />
      <HomePage />
    </>
  );
}
