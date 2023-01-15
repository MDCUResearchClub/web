import { GetStaticProps } from "next";

import Page from "../../components/Page";
import { useStrapi, fetchStrapi } from "../../lib/strapi";
import NewsCard from "../../components/news/NewsCard";

function NewsGallery({ fallbackNewsData }) {
  const { data: news } = useStrapi("/news-articles?populate[0]=preview", {
    dataOptions: { fallbackData: fallbackNewsData },
  });

  return news ? (
    news.map((newsItem) => (
      <NewsCard
        key={newsItem.id}
        theme="light"
        title={newsItem.attributes.title}
        description={newsItem.attributes.description}
        href={`/news/${newsItem.id}`}
        image={newsItem.attributes.preview.data?.attributes}
        className="col-span-2"
      />
    ))
  ) : (
    <>
      <NewsCard className="md:col-span-2" />
      <NewsCard className="md:col-span-2" />
    </>
  );
}

export default function NewsPage({ fallbackNewsData }) {
  return (
    <Page title="News">
      <div className="px-2 md:px-4 lg:px-16 container mx-auto py-4">
        <h1 className="font-serif text-3xl mb-4 text-center">News</h1>
        <div className="grid md:grid-cols-4">
          <NewsGallery fallbackNewsData={fallbackNewsData} />
        </div>
      </div>
    </Page>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const newsData = await fetchStrapi("/news-articles?populate[0]=preview").then(
    (res) => (res.ok ? res.json() : null)
  );

  return {
    props: {
      fallbackNewsData: newsData,
    },
  };
};
