import { Metadata } from "next";
import { redirect } from "next/navigation";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import unwrapImages from "remark-unwrap-images";

import { SITE_NAME, SITE_ORIGIN, STRAPI_ENDPOINT } from "../../../lib/constant";
import { fetchStrapi } from "../../strapi";

export const revalidate = 60;

async function ImageRenderer({
  src,
  alt,
}: React.ComponentPropsWithoutRef<"img">) {
  const results = await fetchStrapi(`/upload/files`, {
    filters: { url: { $eq: src } },
  });
  if (results[0]) {
    return (
      <Image
        src={STRAPI_ENDPOINT + src}
        alt={alt}
        width={results[0].width}
        height={results[0].height}
      />
    );
  }
  return null;
}

export default async function NewsItemPage({ params }) {
  const newsItem = await fetchStrapi(`/news-articles/${params.id}`, {
    populate: ["preview", "cover"],
  });
  if (!newsItem || newsItem.publishedAt === null) {
    redirect("/news");
  }

  return (
    <>
      {newsItem && (
        <div className="px-2 md:px-4 lg:px-16 container mx-auto py-4">
          <h1 className="font-serif text-3xl mb-4 text-center">
            {newsItem.title}
          </h1>
          {newsItem.cover && (
            <div className="my-2 md:my-4 mx-auto lg:w-5/6 xl:w-4/6">
              <Image
                src={STRAPI_ENDPOINT + newsItem.cover.url}
                alt={newsItem.cover.alternativeText}
                width={newsItem.cover.width}
                height={newsItem.cover.height}
              />
            </div>
          )}
          <div className="prose mx-auto">
            <ReactMarkdown
              components={{
                // @ts-ignore
                img: ImageRenderer,
              }}
              remarkPlugins={[unwrapImages]}
            >
              {newsItem.body}
            </ReactMarkdown>
          </div>
        </div>
      )}
    </>
  );
}

export async function generateMetadata({ params }): Promise<Metadata> {
  const newsItem = await fetchStrapi(`/news-articles/${params.id}`, {
    populate: ["preview", "cover"],
  });
  if (!newsItem || newsItem.publishedAt !== null) {
    return {
      title: "Redirecting... | " + SITE_NAME,
    };
  }
  return {
    title: newsItem.title,
    description: newsItem.description,
    openGraph: {
      url: SITE_ORIGIN + "/news/" + newsItem.id,
      type: "website",
      title: newsItem.title + " | " + SITE_NAME,
      description: newsItem.description,
      images: [
        {
          url:
            STRAPI_ENDPOINT +
            (newsItem.preview?.url ?? newsItem.cover?.url ?? ""),
        },
      ],
    },
  };
}

export async function generateStaticParams() {
  const res = await fetchStrapi("/news-articles");
  return res.map((item) => ({
    id: String(item.id),
  }));
}
