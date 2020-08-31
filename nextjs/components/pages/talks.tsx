import Page from "../page";
import { useStrapi } from "../../lib/strapi";
import { useSession } from "next-auth/client";
import Link from "next/link";
import { useRouter } from "next/router";
import Hero from "../parts/Hero";
import { useState, useEffect } from "react";

function ShowTalks() {
  const strapi = useStrapi("/research-talks");

  if (strapi.data) {
    return (
      <>
        <h1 className="text-center text-3xl md:text-4xl xl:text-5xl leading-relaxed my-2 font-serif">
          Research talks
        </h1>
        <div className="container mx-auto p-2 lg:flex flex-wrap text-blue-900">
          {strapi.data.map((talk) => (
            <Link href="/talks/[id]" as={`/talks/${talk.id}`} key={talk.id}>
              <a className="block p-4 lg:w-1/3">
                <div className="flex flex-col sm:flex-row lg:flex-col h-full lg:justify-center items-center shadow rounded border border-solid border-gray-200 overflow-hidden">
                  <img
                    className="block sm:w-1/3 md:w-1/4 lg:w-full"
                    src={`https://i.ytimg.com/vi/${talk.youtubeID}/sddefault.jpg`}
                    alt={talk.title + " poster"}
                  />
                  <h2 className="block m-4 sm:text-xl lg:font-semibold">
                    {talk.title}
                  </h2>
                </div>
              </a>
            </Link>
          ))}
          <div className="block p-4 lg:w-1/3">
            <div className="flex flex-col sm:flex-row lg:flex-col h-full justify-center items-center shadow rounded border border-solid border-gray-200 overflow-hidden">
              <img
                className="hidden lg:block lg:w-1/4"
                src="/logo.svg"
                alt=""
              />
              <h2 className="block m-4 sm:text-xl lg:font-semibold">
                More soon.
              </h2>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <Hero
      heading={["Research Talks are", "loading..."]}
      image="/images/peep2.svg"
    />
  );
}

export default function TalksPage() {
  const [session, loading] = useSession();
  const Router = useRouter();
  const [loadingTalk, setLoadingTalk] = useState(false);

  let content;
  if (!session && !loading) {
    content = (
      <Hero
        heading={["Research Talks are", "for members."]}
        image="/images/peep1.svg"
        ctaText="Loading..."
      />
    );
  } else if (loadingTalk) {
    content = (
      <Hero
        heading={["Research Talks are", "loading..."]}
        image="/images/peep2.svg"
      />
    );
  } else {
    content = <ShowTalks />;
  }

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      if (url.startsWith("/talks/")) {
        setLoadingTalk(true);
      }
    };
    Router.events.on("routeChangeStart", handleRouteChange);
    return () => {
      Router.events.off("routeChangeStart", handleRouteChange);
    };
  }, []);
  return <Page title="Research Talks">{content}</Page>;
}
