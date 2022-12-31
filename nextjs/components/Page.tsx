import Head from "next/head";
import Nav from "./common/Nav";
import Footer from "./common/Footer";
import { SITE_NAME } from "../lib/constant";

export default function Page({
  title = "",
  description = "MDCU Research Club",
  children,
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <Head>
        <title>{title ? `${title} | ${SITE_NAME}` : SITE_NAME}</title>
        <meta name="description" content={description} />
      </Head>
      <Nav />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
