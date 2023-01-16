import { GetStaticProps } from "next";
import Link from "next/link";

import Page from "../../components/Page";
import { useStrapi, fetchStrapi } from "../../lib/strapi";

export default function InsightsPage({ fallbackInsightData }) {
  const { data: insightData } = useStrapi("/research-insights", {
    dataOptions: { fallbackData: fallbackInsightData },
  });

  let content = null;

  if (insightData) {
    content = (
      <div className="container mx-auto max-w-screen-lg px-2 pb-8 text-blue-900">
        {insightData.map((insight) => (
          <Link
            href="/insights/[id]"
            as={`/insights/${insight.id}`}
            key={insight.id}
            className="block p-4"
          >
            <div className="flex h-full items-center shadow rounded border border-solid border-gray-200 overflow-hidden">
              <img
                className="block sm:w-1/3 md:w-1/4"
                src={`https://i.ytimg.com/vi/${insight.attributes.youtubeID}/hqdefault.jpg`}
                alt={insight.attributes.title + " poster"}
              />
              <h2 className="block m-4 sm:text-xl lg:font-semibold">
                {insight.attributes.title}
              </h2>
            </div>
          </Link>
        ))}
      </div>
    );
  }

  return (
    <Page title="Research Insight">
      <h1 className="text-center text-3xl md:text-4xl xl:text-5xl leading-relaxed md:leading-relaxed xl:leading-relaxed font-serif">
        Research insight
      </h1>
      {content}
    </Page>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const researchInsightData = await fetchStrapi("/research-insights").then(
    (res) => (res.ok ? res.json() : null)
  );

  return {
    props: {
      fallbackInsightData: researchInsightData,
    },
  };
};
