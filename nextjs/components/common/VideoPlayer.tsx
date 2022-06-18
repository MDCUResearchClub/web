import { useEffect, useRef } from "react";
import Plyr from "plyr";
import Head from "next/head";
import { SITE_ORIGIN } from "../../lib/constant";

type VideoPlayerProps = React.ComponentProps<"div"> & {
  videoID: string;
  options?: object;
};

function VideoPlayer({
  videoID = "dQw4w9WgXcQ",
  options = {},
}: VideoPlayerProps) {
  const playerRef = useRef();

  useEffect(() => {
    const player = new Plyr(playerRef.current, options) as any;

    return () => {
      if (player.dispose) {
        player.dispose();
      }
    };
  }, []);

  if (!videoID.match(/^[\w-]{11}$/)) {
    throw "Invalid videoID";
  }

  const src = `https://www.youtube.com/embed/${videoID}?origin=${encodeURIComponent(
    SITE_ORIGIN
  )}&amp;iv_load_policy=3&amp;modestbranding=1&amp;playsinline=1&amp;showinfo=0&amp;rel=0&amp;enablejsapi=1`;

  return (
    <>
      <Head>
        <link rel="stylesheet" href="https://cdn.plyr.io/3.6.2/plyr.css" />
      </Head>
      <div
        ref={playerRef}
        className="plyr__video-embed"
        dangerouslySetInnerHTML={{
          __html: `
          <iframe
          src=${src}
          allowfullscreen
          allowtransparency
          allow="autoplay"
          ></iframe>
          `,
        }}
      ></div>
    </>
  );
}

export default VideoPlayer;
