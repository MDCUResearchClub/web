import { GetStaticProps } from "next";
import Link from "next/link";

import Page from "../../components/Page";
import { useStrapi, fetchStrapi } from "../../lib/strapi";

function ShowTalks({ fallbackTalkData }) {
  const { data: talkData } = useStrapi("/research-talks", {
    dataOptions: { fallbackData: fallbackTalkData },
  });

  const researchTalk = talkData.filter(
    (talk) => talk.attributes.type === "research talk"
  );
  const researchJourney = talkData.filter(
    (talk) => talk.attributes.type === "research journey"
  );
  const coop = talkData.filter(
    (talk) => talk.attributes.type === "co-operation"
  );

  if (talkData) {
    return (
      <>
        <h1 className="text-center text-3xl md:text-4xl xl:text-5xl leading-relaxed md:leading-relaxed xl:leading-relaxed font-serif">
          Research talk
        </h1>
        <div className="container mx-auto max-w-screen-lg px-2 pb-8 text-blue-900">
          <section>
            <h2 className="text-black border-4 border-solid border-pink-500 inline-block p-2 text-xl md:text-2xl xl:text-3xl font-serif">
              Research talk
            </h2>
            {researchTalk.map((talk) => (
              <Link
                href="/talks/[id]"
                as={`/talks/${talk.id}`}
                key={talk.id}
                className="block p-4"
              >
                <div className="flex h-full items-center shadow rounded border border-solid border-gray-200 overflow-hidden">
                  <img
                    className="block sm:w-1/3 md:w-1/4"
                    src={`https://i.ytimg.com/vi/${talk.attributes.youtubeID}/hqdefault.jpg`}
                    alt={talk.attributes.title + " poster"}
                  />
                  <h2 className="block m-4 sm:text-xl lg:font-semibold">
                    {talk.attributes.title}
                  </h2>
                </div>
              </Link>
            ))}
          </section>
          <section>
            <h2 className="text-black border-4 border-solid border-pink-500 inline-block p-2 text-xl md:text-2xl xl:text-3xl my-2 font-serif">
              Research journey
            </h2>
            {researchJourney.map((talk) => (
              <Link
                href="/talks/[id]"
                as={`/talks/${talk.id}`}
                key={talk.id}
                className="block p-4"
              >
                <div className="flex h-full items-center shadow rounded border border-solid border-gray-200 overflow-hidden">
                  <img
                    className="block sm:w-1/3 md:w-1/4"
                    src={`https://i.ytimg.com/vi/${talk.attributes.youtubeID}/hqdefault.jpg`}
                    alt={talk.attributes.title + " poster"}
                  />
                  <h2 className="block m-4 sm:text-xl lg:font-semibold">
                    {talk.attributes.title}
                  </h2>
                </div>
              </Link>
            ))}
          </section>
          <section>
            <h2 className="text-black border-4 border-solid border-pink-500 inline-block p-2 text-xl md:text-2xl xl:text-3xl my-2 font-serif">
              Co-operation
            </h2>
            {coop.map((talk) => (
              <Link
                href="/talks/[id]"
                as={`/talks/${talk.id}`}
                key={talk.id}
                className="block p-4"
              >
                <div className="flex h-full items-center shadow rounded border border-solid border-gray-200 overflow-hidden">
                  <img
                    className="block sm:w-1/3 md:w-1/4"
                    src={`https://i.ytimg.com/vi/${talk.attributes.youtubeID}/hqdefault.jpg`}
                    alt={talk.attributes.title + " poster"}
                  />
                  <h2 className="block m-4 sm:text-xl lg:font-semibold">
                    {talk.attributes.title}
                  </h2>
                </div>
              </Link>
            ))}
          </section>
        </div>
      </>
    );
  }

  return null;
}

export default function TalksPage({ fallbackTalkData }) {
  return (
    <Page title="Research Talk">
      <ShowTalks fallbackTalkData={fallbackTalkData} />
    </Page>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const researchTalkData = await fetchStrapi("/research-talks").then((res) =>
    res.ok ? res.json() : null
  );

  return {
    props: {
      fallbackTalkData: researchTalkData,
    },
  };
};
