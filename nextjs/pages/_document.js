import Document, { Html, Head, Main, NextScript } from "next/document";
import { HEAD_SCRIPT } from "../lib/gtag";

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
          <meta name="theme-color" content="#000" />
          <meta
            name="google-site-verification"
            content="IZCRXZBnxXQG-WklRrjvGosyO69S8WLnMvyj6OChCkQ"
          />
          <script
            dangerouslySetInnerHTML={{
              __html: `
              </script>
              ${HEAD_SCRIPT}
              <script>
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
