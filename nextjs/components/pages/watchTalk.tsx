import { getSession } from "next-auth/client";
import { GetServerSideProps } from "next";
import ReactMarkdown from "react-markdown";
import { fetchStrapiServerSide } from "../../lib/strapi";
import Page from "../page";
import Hero from "../parts/Hero";
import VideoPlayer from "../parts/VideoPlayer";

export default function watchTalk({ talk }) {
  if (!talk?.id) {
    return (
      <Page>
        <Hero
          heading={["Research Talks are", "Loading..."]}
          image="/images/peep2.svg"
        />
      </Page>
    );
  }

  return (
    <Page title={talk.title + " talks"}>
      <div className="bg-black">
        <div className="container mx-auto md:max-w-xl lg:max-w-2xl xl:max-w-3xl">
          <VideoPlayer videoID={talk.youtubeID} />
        </div>
      </div>
      <div className="container mx-auto p-6">
        <h1 className="text-xl md:text-2xl font-semibold mb-2">{talk.title}</h1>
        <ReactMarkdown>{talk.description}</ReactMarkdown>
      </div>
    </Page>
  );
}

export const getServerSideProps: GetServerSideProps = async function (context) {
  const session = await getSession(context);

  if (!session) {
    context.res.writeHead(302, { Location: "/talks" });
    context.res.end();
  }

  const talk = await fetchStrapiServerSide(
    `/research-talks/${context.params.id}`
  );

  return {
    props: { session, talk },
  };
};
