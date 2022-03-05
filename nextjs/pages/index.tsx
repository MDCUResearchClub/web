import { useSession } from "next-auth/react";
import Link from "next/link";
import { GetStaticProps } from "next";
import { SWRConfig } from "swr";

import Page from "../components/Page";
import Hero from "../components/common/Hero";
import NewsCard from "../components/news/NewsCard";
import { useStrapi, fetchStrapiPublic } from "../lib/strapi";

function LatestTalk() {
  const { data: talks } = useStrapi("/research-talks?_limit=1&_sort=id:desc");
  return (
    <NewsCard
      theme="dark"
      intro="Latest talk »»"
      title={talks?.[0]?.title}
      href={talks?.[0]?.id ? `/talks/${talks[0]?.id}` : undefined}
    />
  );
}

function NewsIndex() {
  const { status } = useSession();
  const { data: news } = useStrapi("/news-articles?_limit=4", {
    isPublic: true,
  });

  const newsCard = news
    ? news.map((newItem) => (
        <NewsCard
          className="md:col-span-2"
          key={newItem.id}
          theme="light"
          title={newItem.title}
          description={newItem.description}
          href={`/news/${newItem.id}`}
          image={newItem.preview}
        />
      ))
    : null;

  let firstRow = (
    <div className="grid md:grid-cols-4">
      <NewsCard className="md:col-span-2" />
      <NewsCard className="md:col-span-2" />
    </div>
  );
  let secondRow;
  if (news) {
    if (status === "authenticated") {
      firstRow = (
        <div className="grid md:grid-cols-3">
          {news[0] && newsCard[0]}
          <LatestTalk />
        </div>
      );
      secondRow = (
        <div className="grid md:grid-cols-4">
          {news[1] && newsCard[1]}
          {news[2] && newsCard[2]}
        </div>
      );
    } else {
      firstRow = (
        <div className="grid md:grid-cols-4">
          {news[0] && newsCard[0]}
          {news[1] && newsCard[1]}
        </div>
      );
      secondRow = (
        <div className="grid md:grid-cols-4">
          {news[2] && newsCard[2]}
          {news[3] && newsCard[3]}
        </div>
      );
    }
  }

  return (
    <section className="px-2 md:px-4 lg:px-16 container mx-auto py-4">
      <Link href="/news">
        <a>
          <h2 className="font-serif text-3xl mb-4 hover:underline">News</h2>
        </a>
      </Link>
      {firstRow}
      {secondRow}
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
          ctaText="Watch Research Talks"
          ctaHref="/talks"
          imageClassName="justify-center"
        />
        <NewsIndex />
      </Page>
    </SWRConfig>
  );
}

export const getStaticProps: GetStaticProps = async function (context) {
  const talks = await fetchStrapiPublic(
    "/research-talks?_limit=1&_sort=id:desc"
  ).then((res) => (res.ok ? res.json() : null));
  const news = await fetchStrapiPublic("/news-articles?_limit=4").then((res) =>
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
