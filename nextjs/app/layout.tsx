import { Metadata, Viewport } from "next";
import { Arvo, Cabin } from "next/font/google";

import { STRAPI_ENDPOINT } from "../lib/constant";

import Nav from "../components/common/Nav";
import Footer from "../components/common/Footer";
import { GoogleTag } from "./gtag";

import "../lib/globals.css";

export const viewport: Viewport = {
  themeColor: "#000",
};

export const metadata: Metadata = {
  title: {
    template: "%s | MDCU Research Club",
    default: "Home | MDCU Research Club",
  },
  description:
    "MDCU Research Club, Students Academic Affairs, Faculty of Medicine, Chulalongkorn University",
};

const arvo = Arvo({
  style: ["normal", "italic"],
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-arvo",
});

const cabin = Cabin({
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-cabin",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${arvo.variable} ${cabin.variable}`}>
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
        crossOrigin="anonymous"
      />
      <body>
        <div className="flex flex-col min-h-screen">
          <Nav />
          <main>{children}</main>
          <Footer />
        </div>
        <GoogleTag />
      </body>
    </html>
  );
}
