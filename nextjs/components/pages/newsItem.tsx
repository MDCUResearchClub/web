import { GetStaticProps, GetStaticPaths } from "next";
import { useRouter } from "next/router";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import unwrapImages from "remark-unwrap-images";

import { STRAPI_ENDPOINT } from "../../lib/constant";
import Page from "../Page";
import { useStrapi, fetchStrapiPublic } from "../../lib/strapi";

function ImageRenderer(bodyImages) {
  return ({ src, alt }) => (
    <Image
      src={STRAPI_ENDPOINT + src}
      width={bodyImages[src].width}
      height={bodyImages[src].height}
      alt={alt}
      layout="responsive"
    />
  );
}

export default function NewsPage({ staticNewsItem }) {
  const router = useRouter();
  const { data: newsItem, dataError } = useStrapi(
    `/news-articles/${router.query.id}`
  );
  if (dataError) {
    router.replace("/news");
  }
  const finalNewsItem = newsItem || staticNewsItem;

  const renderers = {
    image: ImageRenderer(finalNewsItem ? finalNewsItem["bodyImages"] : {}),
  };

  return (
    <Page
      title="News"
      description={finalNewsItem ? finalNewsItem.description : ""}
    >
      {finalNewsItem && (
        <div className="px-2 md:px-4 lg:px-16 container mx-auto py-4">
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
            <ReactMarkdown renderers={renderers} plugins={[unwrapImages]}>
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
