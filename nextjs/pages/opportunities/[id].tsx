import { useRouter } from "next/router";
import Head from "next/head";
import ReactMarkdown from "react-markdown";

import { SITE_NAME, SITE_ORIGIN } from "../../lib/constant";
import Page from "../../components/Page";
import { useStrapi } from "../../lib/strapi";

export default function OpportunityItemPage() {
  const router = useRouter();
  const { data: opportunityItem, dataError } = useStrapi(
    `/opportunities/${router.query.id}`
  );
  if (dataError) {
    router.replace("/opportunities");
  }

  return (
    <Page title={opportunityItem ? opportunityItem.title : "Opportunities"}>
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
              content={opportunityItem.title + " | " + SITE_NAME}
            />
          </Head>
          <h1 className="font-serif text-3xl mb-8 text-center">
            {opportunityItem.title}
          </h1>
          <div className="prose mx-auto">
            <ReactMarkdown>{opportunityItem.details}</ReactMarkdown>
          </div>
        </div>
      )}
    </Page>
  );
}
