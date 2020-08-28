import { useEffect } from "react";
import Router from "next/router";
import { pageview } from "../lib/gtag";
import "../lib/globals.css";

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    const handleRouteChange = (url) => {
      pageview(url);
    };
    Router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      Router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, []);

  return <Component {...pageProps} />;
}

export default MyApp;
