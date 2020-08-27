import Head from "next/head";
import Nav from "./nav";
import Footer from "./footer";
import { SITE_NAME } from "../constant";

export default function Page({ title = "", children }) {
  return (
    <div>
      <Head>
        <title>
          {title ? `${title} | ` : ""}
          {SITE_NAME}
        </title>
      </Head>
      <Nav />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
