"use client";
import Script from "next/script";

export const G_TRACKING_ID =
  process.env.NODE_ENV === "production" ? "G-HDHM4V8SR6" : "G-G832CFVLYM";

export function GoogleTag() {
  return (
    <>
      <Script
        id="gtm-init"
        dangerouslySetInnerHTML={{
          __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${G_TRACKING_ID}');`,
        }}
      />
      <Script
        id="gtm"
        src={`https://www.googletagmanager.com/gtm.js?id=${G_TRACKING_ID}`}
      />
    </>
  );
}
