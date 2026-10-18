import { TeamsPage } from "@/components/teams/TeamsPage";
import { JsonLd } from "@/components/measurement/JsonLd";
import { pageMetadata } from "@/lib/meta";

export const metadata = pageMetadata("/teams");

export default function Route() {
  return (
    <>
      <JsonLd path="/teams" />
      <TeamsPage />
    </>
  );
}
