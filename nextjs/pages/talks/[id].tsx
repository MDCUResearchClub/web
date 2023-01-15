import { useRouter } from "next/router";
import ReactMarkdown from "react-markdown";

import { useStrapi } from "../../lib/strapi";

import Page from "../../components/Page";
import Hero from "../../components/common/Hero";
import VideoPlayer from "../../components/common/VideoPlayer";

export default function TalkItemPage() {
  const router = useRouter();
  const { data: talkItem, dataError } = useStrapi(
    router.query.id && `/research-talks/${router.query.id}`,
    {
      immutable: true,
    }
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
    <Page title={talkItem.attributes.title + " talks"}>
      <div className="bg-black">
        <div className="container mx-auto md:max-w-xl lg:max-w-2xl xl:max-w-3xl">
          <VideoPlayer videoID={talkItem.attributes.youtubeID} />
        </div>
      </div>
      <div className="container mx-auto p-6">
        <h1 className="text-xl md:text-2xl font-semibold mb-2">
          {talkItem.attributes.title}
        </h1>
        <div className="prose mx-auto">
          <ReactMarkdown>{talkItem.attributes.description}</ReactMarkdown>
        </div>
      </div>
    </Page>
  );
}
