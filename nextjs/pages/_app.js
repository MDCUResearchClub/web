import { useEffect } from "react";
import Router from "next/router";
import { SessionProvider } from "next-auth/react";
import { pageview, config as gtagConfig } from "../lib/gtag";
import "../lib/globals.css";

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    gtagConfig();
    const handleRouteChange = () => {
      pageview();
    };
    Router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      Router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, []);

  return (
    <SessionProvider session={pageProps.session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
}

export default MyApp;
