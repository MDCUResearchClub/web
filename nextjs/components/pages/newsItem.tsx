import { GetStaticProps, GetStaticPaths } from "next";
import { useRouter } from "next/router";
import Image from "next/image";
import Head from "next/head";
import ReactMarkdown from "react-markdown";
import unwrapImages from "remark-unwrap-images";

import { SITE_NAME, SITE_ORIGIN, STRAPI_ENDPOINT } from "../../lib/constant";
import Page from "../Page";
import { useStrapi, fetchStrapiPublic } from "../../lib/strapi";

function ImageRenderer(bodyImages) {
  function MarkdownImage({ src, alt }: React.ComponentPropsWithoutRef<"img">) {
    return (
      <Image
        src={STRAPI_ENDPOINT + src}
        width={bodyImages[src].width}
        height={bodyImages[src].height}
        alt={alt}
        layout="responsive"
      />
    );
  }
  return MarkdownImage;
}

export default function NewsPage({ staticNewsItem }) {
  const router = useRouter();
  const { data: newsItem, dataError } = useStrapi(
    router.query.id ? `/news-articles/${router.query.id}` : null
  );

  if (dataError) {
    router.replace("/news");
  }
  const finalNewsItem = newsItem || staticNewsItem;

  const ogImage =
    finalNewsItem &&
    (finalNewsItem.preview?.url || finalNewsItem.cover?.url || "");

  return (
    <Page
      title={finalNewsItem ? finalNewsItem.title : "News"}
      description={finalNewsItem ? finalNewsItem.description : ""}
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
              content={finalNewsItem.title + " | " + SITE_NAME}
            />
            <meta
              property="og:description"
              content={finalNewsItem.description}
            />
            {ogImage && (
              <meta property="og:image" content={STRAPI_ENDPOINT + ogImage} />
            )}
          </Head>
          <h1 className="font-serif text-3xl mb-4 text-center">
            {finalNewsItem.title}
          </h1>
          {finalNewsItem.cover && (
            <div className="my-2 md:my-4 mx-auto lg:w-5/6 xl:w-4/6">
              <Image
                src={STRAPI_ENDPOINT + finalNewsItem.cover.url}
                alt=""
                width={finalNewsItem.cover.width}
                height={finalNewsItem.cover.height}
                layout="responsive"
              />
            </div>
          )}
          <div className="prose mx-auto">
            <ReactMarkdown
              components={{
                img: ImageRenderer(
                  finalNewsItem ? finalNewsItem["bodyImages"] : {}
                ),
              }}
              plugins={[unwrapImages]}
            >
              {finalNewsItem.body}
            </ReactMarkdown>
          </div>
        </div>
      )}
    </Page>
  );
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const res = await fetchStrapiPublic("/news-articles/" + params.id);

  const staticNewsItem = res.ok ? await res.json() : null;

  return {
    props: {
      staticNewsItem,
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const res = await fetchStrapiPublic("/news-articles");
  const staticNews = res.ok ? await res.json() : [];
  const paths = staticNews.map((newsItem) => ({
    params: { id: String(newsItem.id) },
  }));
  return {
    paths,
    fallback: true,
  };
};
