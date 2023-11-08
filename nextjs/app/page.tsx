import Link from "next/link";

import Hero from "../components/common/Hero";
import NewsCard from "./NewsCard";
import { fetchStrapi } from "./strapi";
import { STRAPI_ENDPOINT } from "../lib/constant";

export const revalidate = 60;

async function LatestTalk() {
  const data = await fetchStrapi("/research-talks", {
    sort: "id:desc",
    pagination: {
      page: 1,
      size: 1,
    },
  });
  return (
    <NewsCard
      theme="dark"
      title={data?.[0]?.title}
      href={data?.[0]?.id ? `/talks/${data[0]?.id}` : undefined}
    />
  );
}

async function NewsIndex() {
  const news = await fetchStrapi("/news-articles", {
    sort: "id:desc",
    pagination: {
      page: 1,
      size: 4,
    },
  });

  const newsCard = news
    ? news.map((newItem) => (
        <NewsCard
          key={newItem.id}
          theme="light"
          title={newItem.title}
          description={newItem.description}
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

export default function IndexPage() {
  return (
    <>
      <Hero
        heading={["Research is", "not as hard", "as you think."]}
        image="/images/front.svg"
        ctaText="Watch Research Talk"
        ctaHref="/talks"
        imageClassName="justify-center"
      />
      <NewsIndex />
    </>
  );
}
