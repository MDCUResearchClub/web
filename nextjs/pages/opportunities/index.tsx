import { GetStaticProps } from "next";
import Link from "next/link";

import Page from "../../components/Page";
import { useStrapi, fetchStrapi } from "../../lib/strapi";

function OpportunitiesCard({ opportunity }) {
  return (
    <Link
      href={`/opportunities/${opportunity.id}`}
      className="block m-2 p-2 md:p-4 border-solid border-2 border-blue-500 rounded"
    >
      <h3 className="my-4 text-xl">{opportunity.attributes.title}</h3>
    </Link>
  );
}

function OpportunitiesIndex({ opportunitiesData }) {
  const { data: opportunities } = useStrapi("/opportunities", {
    dataOptions: { fallbackData: opportunitiesData },
  });
  if (opportunities) {
    return (
      <div className="grid md:grid-cols-2">
        {opportunities.map((opportunity) => (
          <OpportunitiesCard opportunity={opportunity} key={opportunity.id} />
        ))}
      </div>
    );
  }

  return null;
}

export default function OpportunitiesPage({ opportunitiesData }) {
  return (
    <Page title="Opportunities">
      <div className="px-2 md:px-4 lg:px-16 container mx-auto py-4">
        <h1 className="font-serif text-3xl mb-4 text-center">
          Research Opportunities
        </h1>
        <OpportunitiesIndex opportunitiesData={opportunitiesData} />
      </div>
    </Page>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const opportunitiesData = await fetchStrapi("/opportunities").then((res) =>
    res.ok ? res.json() : null
  );

  return {
    props: {
      opportunitiesData: opportunitiesData,
    },
  };
};
