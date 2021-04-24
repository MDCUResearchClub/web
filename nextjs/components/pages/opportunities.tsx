import Link from "next/link";
import { useSession } from "next-auth/client";

import Page from "../Page";
import { useStrapi } from "../../lib/strapi";
import Hero from "../layouts/Hero";

function OpportunitiesCard({ opportunity }) {
  return (
    <Link href={`/opportunities/${opportunity.id}`}>
      <a className="block m-2 p-2 md:p-4 border-solid border-2 border-blue-500 rounded">
        <h3 className="my-4 text-xl">{opportunity.title}</h3>
      </a>
    </Link>
  );
}

export default function OpportunitiesPage() {
  const { data: opportunities, dataError } = useStrapi("/opportunities");

  if (dataError) {
    return (
      <Page title="Opportunities">
        <Hero
          heading={["Opportunities are", "for members."]}
          image="/images/peep1.svg"
          ctaText="Loading..."
        />
      </Page>
    );
  }

  const opportunitiesCard = opportunities
  ? opportunities.map((opportunity) => (
      <OpportunitiesCard opportunity={opportunity} key={opportunity.id} />
    ))
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
