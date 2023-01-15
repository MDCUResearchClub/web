import { GetStaticProps, GetStaticPaths } from "next";
import { useRouter } from "next/router";
import Image from "next/image";
import Head from "next/head";
import ReactMarkdown from "react-markdown";
import unwrapImages from "remark-unwrap-images";

import { SITE_NAME, SITE_ORIGIN, STRAPI_ENDPOINT } from "../../lib/constant";
import Page from "../../components/Page";
import { useStrapi, fetchStrapi } from "../../lib/strapi";

function ImageRenderer({ src, alt }: React.ComponentPropsWithoutRef<"img">) {
  const results = useStrapi(
    `/upload/files?pagination[limit]=1&filters[url]=${src}`
  );
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

export default function NewsItemPage({ staticNewsItem }) {
  const router = useRouter();
  const { data: newsItem, dataError } = useStrapi(
    router.query.id
      ? `/news-articles/${router.query.id}` +
          "?populate[0]=preview&populate[1]=cover"
      : null,
    { dataOptions: { fallbackData: staticNewsItem } }
  );

  if (dataError) {
    router.replace("/news");
  }

  const ogImage =
    newsItem &&
    (newsItem.attributes.preview.data?.attributes.url ||
      newsItem.attributes.cover.data?.attributes.url ||
      "");

  return (
    <Page
      title={newsItem ? newsItem.attributes.title : "News"}
      description={newsItem ? newsItem.attributes.description : ""}
    >
      {newsItem && (
        <div className="px-2 md:px-4 lg:px-16 container mx-auto py-4">
          <Head>
            <meta
              property="og:url"
              content={SITE_ORIGIN + "/news/" + router.query.id}
            />
            <meta property="og:type" content="website" />
            <meta
              property="og:title"
              content={newsItem.attributes.title + " | " + SITE_NAME}
            />
            <meta
              property="og:description"
              content={newsItem.attributes.description}
            />
            {ogImage && (
              <meta property="og:image" content={STRAPI_ENDPOINT + ogImage} />
            )}
          </Head>
          <h1 className="font-serif text-3xl mb-4 text-center">
            {newsItem.attributes.title}
          </h1>
          {newsItem.attributes.cover.data && (
            <div className="my-2 md:my-4 mx-auto lg:w-5/6 xl:w-4/6">
              <Image
                src={
                  STRAPI_ENDPOINT +
                  newsItem.attributes.cover.data.attributes.url
                }
                alt={newsItem.attributes.cover.data.attributes.alternativeText}
                width={newsItem.attributes.cover.data.attributes.width}
                height={newsItem.attributes.cover.data.attributes.height}
              />
            </div>
          )}
          <div className="prose mx-auto">
            <ReactMarkdown
              components={{
                img: ImageRenderer,
              }}
              remarkPlugins={[unwrapImages]}
            >
              {newsItem.attributes.body}
            </ReactMarkdown>
          </div>
        </div>
      )}
    </Page>
  );
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const staticNewsItem = await fetchStrapi(
    "/news-articles/" + params.id + "?populate[0]=preview&populate[1]=cover"
  ).then((res) => (res.ok ? res.json() : null));

  return {
    props: {
      staticNewsItem: staticNewsItem,
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const res = await fetchStrapi("/news-articles");
  const staticNews = res.ok ? await res.json() : [];
  const paths = staticNews.data.map((newsItem) => ({
    params: { id: String(newsItem.id) },
  }));
  return {
    paths,
    fallback: true,
  };
};
