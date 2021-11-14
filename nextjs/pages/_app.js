import { useEffect } from "react";
import Router from "next/router";
import { Provider as AuthProvider } from "next-auth/client";
import { pageview, config as gtagConfig } from "../lib/gtag";
import "../lib/globals.css";

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    gtagConfig();
    pageview();
    const handleRouteChange = () => {
      pageview();
    };
    Router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      Router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, []);

  return (
    <AuthProvider session={pageProps.session}>
      <Component {...pageProps} />
    </AuthProvider>
  );
}

export default MyApp;
