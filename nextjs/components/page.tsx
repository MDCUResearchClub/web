import Head from "next/head";
import Nav from "./parts/Nav";
import Footer from "./parts/Footer";
import { SITE_NAME } from "../lib/constant";

export default function Page({ title = "", description = "MDCU Research Club", children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Head>
        <title>
          {title ? `${title} | ` : ""}
          {SITE_NAME}
        </title>
        <meta name="description" content={description} />
      </Head>
      <Nav />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
