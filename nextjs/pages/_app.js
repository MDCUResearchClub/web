import { useEffect } from "react";
import Router from "next/router";
import { SessionProvider } from "next-auth/react";
import Script from "next/script";

import { pageview, config as gtagConfig, G_TRACKING_ID } from "../lib/gtag";
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
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${G_TRACKING_ID}`}
        strategy="lazyOnload"
      />
      <script
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
          `,
        }}
      />
      <Component {...pageProps} />
    </SessionProvider>
  );
}

export default MyApp;
