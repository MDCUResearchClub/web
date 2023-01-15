import { GetStaticProps, GetStaticPaths } from "next";
import { useRouter } from "next/router";
import Head from "next/head";
import ReactMarkdown from "react-markdown";

import { SITE_NAME, SITE_ORIGIN } from "../../lib/constant";
import Page from "../../components/Page";
import { useStrapi, fetchStrapi } from "../../lib/strapi";

export default function OpportunityItemPage({ opportunityItemData }) {
  const router = useRouter();
  const { data: opportunityItem, dataError } = useStrapi(
    router.query.id && `/opportunities/${router.query.id}`,
    { dataOptions: { fallbackData: opportunityItemData } }
  );
  if (dataError) {
    router.replace("/opportunities");
  }

  return (
    <Page
      title={opportunityItem ? opportunityItem.attributes.title : "Opportunity"}
    >
      {opportunityItem && (
        <div className="px-2 md:px-4 lg:px-16 container mx-auto py-4">
          <Head>
            <meta
              property="og:url"
              content={SITE_ORIGIN + "/opportunities/" + router.query.id}
            />
            <meta property="og:type" content="website" />
            <meta
              property="og:title"
              content={opportunityItem.attributes.title + " | " + SITE_NAME}
            />
          </Head>
          <h1 className="font-serif text-3xl mb-8 text-center">
            {opportunityItem.attributes.title}
          </h1>
          <div className="prose mx-auto">
            <ReactMarkdown>{opportunityItem.attributes.details}</ReactMarkdown>
          </div>
        </div>
      )}
    </Page>
  );
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const opportunityItemData = await fetchStrapi(
    "/opportunities/" + params.id
  ).then((res) => (res.ok ? res.json() : null));

  return {
    props: {
      opportunityItemData: opportunityItemData,
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const res = await fetchStrapi("/opportunities");
  const opportunitiesData = res.ok ? await res.json() : [];
  const paths = opportunitiesData.data.map((opportunityItem) => ({
    params: { id: String(opportunityItem.id) },
  }));
  return {
    paths,
    fallback: true,
  };
};
