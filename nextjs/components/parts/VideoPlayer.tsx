import { useState, useEffect, memo, useRef } from "react";
import Plyr from "plyr";
import Head from "next/head";
import { SITE_ORIGIN } from "../../lib/constant";

type VideoPlayerProps = React.ComponentProps<"div"> & {
  videoID: string;
  options?: object;
};

function VideoPlayer({
  videoID = "dZ9d3iCh-JQ",
  options = {},
  ...restProps
}: VideoPlayerProps) {
  const playerRef = useRef();
  const [ratio, setRatio] = useState("56.25");

  useEffect(() => {
    const player = new Plyr(playerRef.current, options);

    return () => {
      if (player.dispose) {
        player.dispose();
      }
    };
  }, []);

  const src = `https://www.youtube.com/embed/${videoID}?origin=${encodeURIComponent(
    SITE_ORIGIN
  )}&amp;iv_load_policy=3&amp;modestbranding=1&amp;playsinline=1&amp;showinfo=0&amp;rel=0&amp;enablejsapi=1`;

  return (
    <div ref={playerRef} className="plyr__video-embed">
      <Head>
        <link rel="stylesheet" href="https://cdn.plyr.io/3.6.2/plyr.css" />
      </Head>
      <iframe
        src={src}
        allowFullScreen
        allowtransparency="true"
        allow="autoplay"
      ></iframe>
    </div>
  );
}

export default memo(VideoPlayer);
