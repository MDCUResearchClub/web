import Head from "next/head";
import Nav from "./nav";
import Footer from "./footer";
import { SITE_NAME } from "../lib/constant";

export default function Page({ title = "", children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Head>
        <title>
          {title ? `${title} | ` : ""}
          {SITE_NAME}
        </title>
        <meta name="description" content="MDCU Research Club" />
      </Head>
      <Nav />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
