import { GetStaticProps } from "next";
import Page from "../../components/Page";
import { useStrapi, fetchStrapiPublic } from "../../lib/strapi";
import NewsCard from "../../components/news/NewsCard";

export default function NewsPage({ staticNews }) {
  const { data: news } = useStrapi("/news-articles");
  function getNewsCard(newsItem) {
    return (
      <NewsCard
        key={newsItem.id}
        theme="light"
        title={newsItem.title}
        description={newsItem.description}
        href={`/news/${newsItem.id}`}
        image={newsItem.preview}
        className="col-span-2"
      />
    );
  }

  const newsCard = news ? news.map(getNewsCard) : staticNews.map(getNewsCard);

  return (
    <Page title="News">
      <div className="px-2 md:px-4 lg:px-16 container mx-auto py-4">
        <h1 className="font-serif text-3xl mb-4 text-center">News</h1>
        <div className="grid md:grid-cols-4">{newsCard}</div>
      </div>
    </Page>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const res = await fetchStrapiPublic("/news-articles");
  const staticNews = res.ok ? await res.json() : [];

  return {
    props: {
      staticNews,
    },
  };
};
