import { GetStaticProps, GetStaticPaths } from "next";
import { useRouter } from "next/router";
import Image from "next/image";
import Head from "next/head";
import ReactMarkdown from "react-markdown";
import unwrapImages from "remark-unwrap-images";

import { SITE_NAME, SITE_ORIGIN, STRAPI_ENDPOINT } from "../../lib/constant";
import Page from "../../components/Page";
import { useStrapi, fetchStrapiPublic } from "../../lib/strapi";

function ImageRenderer({ src, alt }: React.ComponentPropsWithoutRef<"img">) {
  const results = useStrapi(
    `/upload/files?pagination[limit]=1&filters[url]=${src}`,
    {
      isPublic: true,
    }
  );
  if (results[0]) {
    return (
      <Image
        src={STRAPI_ENDPOINT + src}
        alt={alt}
        width={results[0].width}
        height={results[0].height}
        layout="responsive"
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
    { isPublic: true }
  );

  if (dataError) {
    router.replace("/news");
  }
  const finalNewsItem = newsItem || staticNewsItem;

  const ogImage =
    finalNewsItem &&
    (finalNewsItem.attributes.preview.data?.attributes.url ||
      finalNewsItem.attributes.cover.data?.attributes.url ||
      "");

  return (
    <Page
      title={finalNewsItem ? finalNewsItem.attributes.title : "News"}
      description={finalNewsItem ? finalNewsItem.attributes.description : ""}
    >
      {finalNewsItem && (
        <div className="px-2 md:px-4 lg:px-16 container mx-auto py-4">
          <Head>
            <meta
              property="og:url"
              content={SITE_ORIGIN + "/news/" + router.query.id}
            />
            <meta property="og:type" content="website" />
            <meta
              property="og:title"
              content={finalNewsItem.attributes.title + " | " + SITE_NAME}
            />
            <meta
              property="og:description"
              content={finalNewsItem.attributes.description}
            />
            {ogImage && (
              <meta property="og:image" content={STRAPI_ENDPOINT + ogImage} />
            )}
          </Head>
          <h1 className="font-serif text-3xl mb-4 text-center">
            {finalNewsItem.attributes.title}
          </h1>
          {finalNewsItem.attributes.cover.data && (
            <div className="my-2 md:my-4 mx-auto lg:w-5/6 xl:w-4/6">
              <Image
                src={
                  STRAPI_ENDPOINT +
                  finalNewsItem.attributes.cover.data.attributes.url
                }
                alt=""
                width={finalNewsItem.attributes.cover.data.attributes.width}
                height={finalNewsItem.attributes.cover.data.attributes.height}
                layout="responsive"
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
              {finalNewsItem.attributes.body}
            </ReactMarkdown>
          </div>
        </div>
      )}
    </Page>
  );
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const res = await fetchStrapiPublic(
    "/news-articles/" + params.id + "?populate[0]=preview&populate[1]=cover"
  );

  const staticNewsItem = res.ok ? await res.json() : null;

  return {
    props: {
      staticNewsItem: staticNewsItem.data,
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const res = await fetchStrapiPublic("/news-articles");
  const staticNews = res.ok ? await res.json() : [];
  const paths = staticNews.data.map((newsItem) => ({
    params: { id: String(newsItem.id) },
  }));
  return {
    paths,
    fallback: true,
  };
};
