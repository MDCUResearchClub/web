import { useSession } from "next-auth/client";
import Link from "next/link";

import Page from "../page";
import Hero from "../parts/Hero";
import { useStrapi } from "../../lib/strapi";
import { NewsCard } from "./news";

function LatestTalk() {
  const { data: talks } = useStrapi("/research-talks?_limit=1&_sort=id:desc");
  return (
    <NewsCard
      theme="dark"
      intro="Latest talk »»"
      title={talks?.[0]?.title || "No talk"}
      href={talks?.[0]?.id ? `/talks/${talks[0]?.id}` : undefined}
    />
  );
}

function NewsIndex() {
  const [session, loadingSession] = useSession();
  const { data: news } = useStrapi("/news-articles?_limit=4");

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

  let firstRow;
  let secondRow;
  if (!loadingSession && news) {
    if (session) {
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
  } else {
    firstRow = (
      <div className="grid md:grid-cols-4">
        <NewsCard className="md:col-span-2" title="Loading" />
        <NewsCard className="md:col-span-2" title="Loading" />
      </div>
    );
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

export default function IndexPage({ message = "" }) {
  const messageBox = (
    <div className="my-12 text-center text-4xl text-yellow-600">{message}</div>
  );
  return (
    <Page title="Home">
      {message ? messageBox : null}
      <Hero
        heading={["Research is", "not as hard", "as you think."]}
        image="/images/front.svg"
        ctaText="Watch Research Talks"
        ctaHref="/talks"
        imageClassName="justify-center"
      />
      <NewsIndex />
    </Page>
  );
}
