import Document, { Html, Head, Main, NextScript } from "next/document";
import { STRAPI_ENDPOINT } from "../lib/constant";
import { UA_TRACKING_ID, G_TRACKING_ID } from "../lib/gtag";

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html lang="en">
        <Head>
          <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href="/favicon/favicon-16x16.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href="/favicon/favicon-32x32.png"
          />
          <link
            rel="apple-touch-icon"
            type="image/png"
            sizes="180x180"
            href="/favicon/apple-touch-icon.png"
          />
          <link rel="shortcut icon" href="/favicon/favicon.ico" />
          <link rel="manifest" href="/manifest.json" />
          <link rel="preconnect" href={STRAPI_ENDPOINT} />
          <meta name="theme-color" content="#000" />
          <meta
            name="google-site-verification"
            content="IZCRXZBnxXQG-WklRrjvGosyO69S8WLnMvyj6OChCkQ"
          />
          <script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=${UA_TRACKING_ID}`}
          />
          <script
            dangerouslySetInnerHTML={{
              __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', '${UA_TRACKING_ID}');
            gtag('config', '${G_TRACKING_ID}');
          `,
            }}
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
