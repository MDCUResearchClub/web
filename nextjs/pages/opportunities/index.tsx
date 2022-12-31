import { useSession } from "next-auth/react";
import Link from "next/link";

import Page from "../../components/Page";
import { useStrapi } from "../../lib/strapi";
import Hero from "../../components/common/Hero";

function OpportunitiesCard({ opportunity }) {
  return (
    (<Link
      href={`/opportunities/${opportunity.id}`}
      className="block m-2 p-2 md:p-4 border-solid border-2 border-blue-500 rounded">

      <h3 className="my-4 text-xl">{opportunity.attributes.title}</h3>

    </Link>)
  );
}

function OpportunitiesIndex() {
  const { data: opportunities } = useStrapi("/opportunities");
  const opportunitiesCard = opportunities
    ? opportunities.map((opportunity) => (
        <OpportunitiesCard opportunity={opportunity} key={opportunity.id} />
      ))
    : null;
  return <div className="grid md:grid-cols-2">{opportunitiesCard}</div>;
}

export default function OpportunitiesPage() {
  const { status } = useSession();
  if (status !== "authenticated") {
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
  return (
    <Page title="Opportunities">
      <div className="px-2 md:px-4 lg:px-16 container mx-auto py-4">
        <h1 className="font-serif text-3xl mb-4 text-center">
          Research Opportunities
        </h1>
        <OpportunitiesIndex />
      </div>
    </Page>
  );
}
