import { useRef } from "react";
import { GetStaticProps } from "next";
import { SWRConfig } from "swr";

import Page from "../../components/Page";
import { useStrapi, fetchStrapiPublic } from "../../lib/strapi";
import NewsCard from "../../components/news/NewsCard";

function NewsGallery() {
  const { data: news } = useStrapi("/news-articles", {
    isPublic: true,
  });

  const cachedNews = useRef<any>();

  if (news) {
    cachedNews.current = news;
  }
  return cachedNews.current
    ? cachedNews.current.map((newsItem) => (
        <NewsCard
          key={newsItem.id}
          theme="light"
          title={newsItem.title}
          description={newsItem.description}
          href={`/news/${newsItem.id}`}
          image={newsItem.preview}
          className="col-span-2"
        />
      ))
    : null;
}

export default function NewsPage({ fallbackData }) {
  return (
    <SWRConfig value={{ fallback: fallbackData }}>
      <Page title="News">
        <div className="px-2 md:px-4 lg:px-16 container mx-auto py-4">
          <h1 className="font-serif text-3xl mb-4 text-center">News</h1>
          <div className="grid md:grid-cols-4">
            <NewsGallery />
          </div>
        </div>
      </Page>
    </SWRConfig>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const news = await fetchStrapiPublic("/news-articles").then((res) =>
    res.ok ? res.json() : null
  );

  return {
    props: {
      fallbackData: {
        "/news-articles": news,
      },
    },
  };
};
