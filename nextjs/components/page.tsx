import Head from "next/head";
import Nav from "./nav";
import { SITE_NAME } from "../constant";

export default function Page({ title = "", children }) {
  return (
    <div className="text-center">
      <Head>
        <title>
          {title ? `${title} | ` : ""}
          {SITE_NAME}
        </title>
      </Head>
      <Nav />
      {children}
    </div>
  );
}
