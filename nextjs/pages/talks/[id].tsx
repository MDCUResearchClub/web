import { useRouter } from "next/router";
import ReactMarkdown from "react-markdown";
import { useStrapi } from "../../lib/strapi";

import Page from "../../components/Page";
import Hero from "../../components/common/Hero";
import VideoPlayer from "../../components/common/VideoPlayer";

export default function TalkItemPage() {
  const router = useRouter();
  const { data: talkItem, dataError } = useStrapi(
    `/research-talks/${router.query.id}`
  );

  if (dataError) {
    router.replace("/talks");
  }
  if (!talkItem?.id) {
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
    <Page title={talkItem.title + " talks"}>
      <div className="bg-black">
        <div className="container mx-auto md:max-w-xl lg:max-w-2xl xl:max-w-3xl">
          <VideoPlayer videoID={talkItem.youtubeID} />
        </div>
      </div>
      <div className="container mx-auto p-6">
        <h1 className="text-xl md:text-2xl font-semibold mb-2">
          {talkItem.title}
        </h1>
        <div className="prose mx-auto">
          <ReactMarkdown>{talkItem.description}</ReactMarkdown>
        </div>
      </div>
    </Page>
  );
}
