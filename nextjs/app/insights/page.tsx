import { Metadata } from "next";
import Link from "next/link";

import { fetchStrapi } from "../strapi";

export const metadata: Metadata = {
  title: "Research Insight",
};

export default async function InsightsPage() {
  const insightData = await fetchStrapi("/research-insights");

  return (
    <>
      <h1 className="text-center text-3xl md:text-4xl xl:text-5xl leading-relaxed md:leading-relaxed xl:leading-relaxed font-serif">
        Research insight
      </h1>
      <div className="container mx-auto max-w-screen-lg px-2 pb-8 text-blue-900">
        {insightData
          ? insightData.map((insight) => (
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
            ))
          : null}
      </div>
    </>
  );
}
