import Document, { Html, Head, Main, NextScript } from "next/document";
import { STRAPI_ENDPOINT } from "../lib/constant";

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
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin="true"
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Arvo:ital,wght@0,400;0,700;1,400;1,700&family=Cabin:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&display=swap"
            rel="stylesheet"
          />
          <meta name="theme-color" content="#000" />
          <meta
            name="google-site-verification"
            content="IZCRXZBnxXQG-WklRrjvGosyO69S8WLnMvyj6OChCkQ"
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
