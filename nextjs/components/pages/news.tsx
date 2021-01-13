import { GetStaticProps } from "next";
import Link from "next/link";
import Image from "next/image";

import { STRAPI_ENDPOINT } from "../../lib/constant";
import Page from "../page";
import { useStrapi, fetchStrapiPublic } from "../../lib/strapi";

import styles from "./news.module.css";

export function NewsCard({
  theme = "light",
  intro,
  title,
  description,
  href = "",
  image,
  className = "",
}: {
  theme?: "light" | "dark";
  intro?: string;
  title: string;
  description?: string;
  href?: string;
  image?: {
    url: string;
    width: number;
    height: number;
  };
  className?: string;
}) {
  const lightTheme = theme === "light";
  const colorClass = lightTheme ? "" : "text-white bg-blue-900";
  return (
    <div
      className={`relative m-2 p-2 md:p-4 border-solid border-2 border-blue-500 rounded ${colorClass} ${styles.card} ${className}`}
    >
      {intro && (
        <span className={`text-lg ${lightTheme ? "" : "text-blue-100"}`}>
          {intro}
        </span>
      )}
      <Link href={href}>
        <a className="relative block z-10 w-3/5 sm:w-3/4 lg:w-1/2">
          <h3 className="my-4 text-xl">{title}</h3>
          {description && <p>{description}</p>}
        </a>
      </Link>
      {image && (
        <div className="absolute top-0 right-0 bottom-0 w-1/2 lg:w-3/5 overflow-hidden">
          <div className="relative h-full ml-auto">
            <Image
              src={STRAPI_ENDPOINT + image.url}
              alt=""
              layout="fill"
              objectFit="cover"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default function NewsPage({ staticNews }) {
  const { data: news } = useStrapi("/news-articles");
  function getNewsCard(newItem) {
    return (
      <NewsCard
        key={newItem.id}
        theme="light"
        title={newItem.title}
        description={newItem.description}
        href={`/news/${newItem.id}`}
        image={newItem.preview}
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
