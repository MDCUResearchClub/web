import Head from "next/head";
import Nav from "./nav";

export default function Page({ title="", children }) {
  return (
    <div className="text-center">
      <Head>
        <title>{title ? `${title} | ` : ""}MDCU Research Club</title>
      </Head>
      <Nav />
      {children}
    </div>
  );
}
