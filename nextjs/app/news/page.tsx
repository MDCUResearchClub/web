import { Metadata } from "next";
import { fetchStrapi } from "../strapi";
import NewsCard from "../NewsCard";

export const metadata: Metadata = {
  title: "News",
};

async function NewsGallery() {
  const news = await fetchStrapi("/news-articles", {
    populate: ["preview"],
  });

  return news ? (
    news.map((newsItem) => (
      <NewsCard
        key={newsItem.id}
        theme="light"
        title={newsItem.title}
        description={newsItem.description}
        href={`/news/${newsItem.id}`}
        image={newsItem.preview?.data || null}
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

export default function NewsPage() {
  return (
    <div className="px-2 md:px-4 lg:px-16 container mx-auto py-4">
      <h1 className="font-serif text-3xl mb-4 text-center">News</h1>
      <div className="grid auto-rows-auto gap-4">
        <NewsGallery />
      </div>
    </div>
  );
}
