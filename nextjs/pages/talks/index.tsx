import { GetStaticProps } from "next";
import Link from "next/link";

import Page from "../../components/Page";
import { useStrapi, fetchStrapi } from "../../lib/strapi";

function ShowTalks({ fallbackTalksData }) {
  const strapi = useStrapi("/research-talks", {
    dataOptions: { fallbackData: fallbackTalksData },
  });

  if (strapi.data) {
    return (
      <>
        <h1 className="text-center text-3xl md:text-4xl xl:text-5xl leading-relaxed md:leading-relaxed xl:leading-relaxed my-2 font-serif">
          Research talk
        </h1>
        <div className="container mx-auto p-2 lg:flex flex-wrap text-blue-900">
          {strapi.data.map((talk) => (
            <Link
              href="/talks/[id]"
              as={`/talks/${talk.id}`}
              key={talk.id}
              className="block p-4 lg:w-1/3"
            >
              <div className="flex flex-col sm:flex-row lg:flex-col h-full lg:justify-center items-center shadow rounded border border-solid border-gray-200 overflow-hidden">
                <img
                  className="block sm:w-1/3 md:w-1/4 lg:w-full"
                  src={`https://i.ytimg.com/vi/${talk.attributes.youtubeID}/hqdefault.jpg`}
                  alt={talk.attributes.title + " poster"}
                />
                <h2 className="block m-4 sm:text-xl lg:font-semibold">
                  {talk.attributes.title}
                </h2>
              </div>
            </Link>
          ))}
          <div className="block p-4 lg:w-1/3">
            <div className="flex flex-col sm:flex-row lg:flex-col h-full justify-center items-center shadow rounded border border-solid border-gray-200 overflow-hidden">
              <img
                className="hidden lg:block lg:w-1/4"
                src="/logo.svg"
                alt=""
              />
              <h2 className="block m-4 sm:text-xl lg:font-semibold">
                More soon.
              </h2>
            </div>
          </div>
        </div>
      </>
    );
  }

  return null;
}

export default function TalksPage({ fallbackTalksData }) {
  return (
    <Page title="Research Talk">
      <ShowTalks fallbackTalksData={fallbackTalksData} />
    </Page>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const researchTalksData = await fetchStrapi("/research-talks").then((res) =>
    res.ok ? res.json() : null
  );

  return {
    props: {
      fallbackTalksData: researchTalksData,
    },
  };
};
