import Page from "../page";
import Hero from "../parts/Hero";

export default function IndexPage({ message = "" }) {
  const messageBox = (
    <div className="my-12 text-center text-4xl text-orange-800">{message}</div>
  );
  return (
    <Page title="Home">
      {message ? messageBox : null}
      <Hero
        heading={["Research is", "not as hard", "as you think."]}
        image="/images/front.svg"
        ctaText="Watch Research Talks"
        ctaHref="/talks"
        imageClassName="justify-center"
      />
    </Page>
  );
}
