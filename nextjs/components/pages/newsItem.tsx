import { GetStaticProps, GetStaticPaths } from "next";
import { useRouter } from "next/router";
import Image from "next/image";
import ReactMarkdown from "react-markdown";

import { STRAPI_ENDPOINT } from "../../lib/constant";
import Page from "../page";
import { useStrapi } from "../../lib/strapi";

export default function NewsPage({ staticNewsItem }) {
  const router = useRouter();
  const { data: newsItem, dataError } = useStrapi(
    `/news-articles/${router.query.id}`
  );
  if (dataError) {
    router.replace("/news");
  }
  const finalNewsItem = newsItem || staticNewsItem;

  return (
    <Page title="News" description={finalNewsItem ? finalNewsItem.description : ""}>
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
              />
            </div>
          )}
          <div className="prose">
            <ReactMarkdown>{finalNewsItem.body}</ReactMarkdown>
          </div>
        </div>
      )}
    </Page>
  );
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const res = await fetch(STRAPI_ENDPOINT + "/news-articles/" + params.id);

  const staticNewsItem = res.ok ? await res.json() : null;

  return {
    props: {
      staticNewsItem,
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const res = await fetch(STRAPI_ENDPOINT + "/news-articles");
  const staticNews = await res.json();
  const paths = staticNews.map((newsItem) => ({
    params: { id: String(newsItem.id) },
  }));
  return {
    paths,
    fallback: true,
  };
};
