import Link from "next/link";

import Page from "../Page";
import { useStrapi } from "../../lib/strapi";

function OpportunitiesCard({ opportunity }) {
  return  <Link href={`/opportunities/${opportunity.id}`}>
  <a className="block m-2 p-2 md:p-4 border-solid border-2 border-blue-500 rounded">
    <h3 className="my-4 text-xl">{opportunity.title}</h3>
  </a>
</Link>
}

export default function OpportunitiesPage() {
  const { data: opportunities } = useStrapi("/opportunities");
  function getOpportunitiesCard(opportunity) {
    return <OpportunitiesCard opportunity={opportunity} />;
  }

  const opportunitiesCard = opportunities
    ? opportunities.map(getOpportunitiesCard)
    : null;

  return (
    <Page title="Opportunities">
      <div className="px-2 md:px-4 lg:px-16 container mx-auto py-4">
        <h1 className="font-serif text-3xl mb-4 text-center">
          Research Opportunities
        </h1>
        <div className="grid md:grid-cols-2">{opportunitiesCard}</div>
      </div>
    </Page>
  );
}
