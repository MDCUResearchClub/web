import Link from "next/link";
import { GetStaticProps } from "next";
import { SWRConfig } from "swr";

import Page from "../components/Page";
import Hero from "../components/common/Hero";
import NewsCard from "../components/news/NewsCard";
import { useStrapi, fetchStrapi } from "../lib/strapi";

function LatestTalk() {
  const { data: talks } = useStrapi("/research-talks?_limit=1&_sort=id:desc");
  return (
    <NewsCard
      theme="dark"
      title={talks?.[0]?.attributes.title}
      href={talks?.[0]?.id ? `/talks/${talks[0]?.id}` : undefined}
    />
  );
}

function NewsIndex() {
  const { data: news } = useStrapi("/news-articles?_limit=4");

  const newsCard = news
    ? news.map((newItem) => (
        <NewsCard
          key={newItem.id}
          theme="light"
          title={newItem.attributes.title}
          description={newItem.attributes.description}
          href={`/news/${newItem.id}`}
        />
      ))
    : null;

  let newsContent = (
    <>
      <NewsCard />
      <NewsCard />
    </>
  );
  if (news) {
    newsContent = (
      <>
        {news && news[0] && newsCard[0]}
        <LatestTalk />
        {news && news[1] && newsCard[1]}
        {news && news[2] && newsCard[2]}
      </>
    );
  }

  return (
    <section className="px-2 md:px-4 lg:px-16 container mx-auto py-4">
      <Link href="/news">
        <h2 className="font-serif text-3xl mb-4 hover:underline">News</h2>
      </Link>
      <div className="grid auto-rows-auto gap-4">{newsContent}</div>
    </section>
  );
}

export default function IndexPage({ fallbackData }) {
  return (
    <SWRConfig value={{ fallback: fallbackData }}>
      <Page title="Home">
        <Hero
          heading={["Research is", "not as hard", "as you think."]}
          image="/images/front.svg"
          ctaText="Watch Research Talk"
          ctaHref="/talks"
          imageClassName="justify-center"
        />
        <NewsIndex />
      </Page>
    </SWRConfig>
  );
}

export const getStaticProps: GetStaticProps = async function (context) {
  const talks = await fetchStrapi(
    "/research-talks?_limit=1&_sort=id:desc"
  ).then((res) => (res.ok ? res.json() : null));
  const news = await fetchStrapi("/news-articles?_limit=4").then((res) =>
    res.ok ? res.json() : null
  );
  return {
    props: {
      fallbackData: {
        "/research-talks?_limit=1&_sort=id:desc": talks,
        "/news-articles?_limit=4": news,
      },
    },
  };
};
