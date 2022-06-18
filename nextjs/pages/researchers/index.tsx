import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import Page from "../../components/Page";
import Hero from "../../components/common/Hero";
import { useStrapi } from "../../lib/strapi";
import Card from "../../components/researcher/Card";
import Loading from "../../components/common/Loading";
import Details from "../../components/researcher/Details";
import {
  DepartmentsIndex,
  KeywordsIndex,
} from "../../components/researcher/Index";

const populateResearcherDetails =
  "populate[0]=emails&populate[1]=links&populate[2]=keywords&populate[3]=division.department&pagination[limit]=100";

function SearchResults() {
  const router = useRouter();
  const { data: department } = useStrapi(
    router.query.department
      ? `/departments/${router.query.department}?populate=divisions`
      : null
  );

  const division = department
    ? department.attributes.divisions.data
        .map((division, i) => `filters[division][id][$in][${i}]=${division.id}`)
        .join("&")
    : "";

  const { data: departmentResearchers } = useStrapi(
    router.query.department && division
      ? `/researchers?${division}&${populateResearcherDetails}`
      : null
  );

  const { data: keywordResearchers } = useStrapi(
    router.query.keyword
      ? `/researchers?filters[keywords][id][$eq]=${router.query.keyword}&${populateResearcherDetails}`
      : null
  );

  const researchers = router.query.department
    ? departmentResearchers
    : keywordResearchers;

  if (researchers === undefined) {
    return <Loading colorClass="bg-blue-600" />;
  }

  if (researchers.length === 0) {
    return null;
  }

  const activeId = router.query.detail || researchers[0].id;
  const activeResearcher = researchers.find(
    (researcher) => activeId == researcher.id
  );
  return (
    <section className="max-w-screen-lg mx-auto flex">
      <div
        className={`space-y-4 w-full md:w-1/2 ${
          router.query.detail ? "hidden md:block" : ""
        }`}
      >
        {researchers.map((researcher) => (
          <Card
            researcher={researcher}
            key={researcher.id}
            active={activeId == researcher.id}
          />
        ))}
      </div>
      <div
        className={`${
          router.query.detail ? "" : "hidden md:block"
        } w-full md:w-1/2`}
      >
        <div className="sticky top-0 p-8">
          <Details researcher={activeResearcher} />
        </div>
      </div>
    </section>
  );
}

function SearchBox() {
  const router = useRouter();
  const { data: department = [] } = useStrapi(
    router.query.department ? `/departments/${router.query.department}` : null
  );

  const { data: keyword = [] } = useStrapi(
    router.query.keyword ? `/keywords/${router.query.keyword}` : null
  );

  return (
    <section className="mb-4 text-xl font-bold text-center">
      {department.length > 0 && (
        <>
          Department :{" "}
          <span className="text-blue-800 capitalize">
            {department[0].title || "Others"}
          </span>
        </>
      )}
      {keyword.length > 0 && (
        <>
          Keyword :{" "}
          <span className="text-blue-800 capitalize">
            {keyword[0].title || "Others"}
          </span>
        </>
      )}
    </section>
  );
}

export default function ResearchersPage() {
  const router = useRouter();
  const { status } = useSession();

  if (status !== "authenticated") {
    return (
      <Page title="Researchers">
        <Hero
          heading={["Researchers are", "for members."]}
          image="/images/peep1.svg"
          ctaText="Loading..."
        />
      </Page>
    );
  }
  const haveQuery = Object.keys(router.query).length > 0;
  return (
    <Page title="Researchers">
      <div className="px-2 md:px-4 lg:px-16 container mx-auto py-4">
        <h1 className="font-serif text-3xl mb-4 text-center">Researchers</h1>
        <SearchBox />
        {haveQuery && <SearchResults />}
        {!haveQuery && <DepartmentsIndex />}
        {!haveQuery && <KeywordsIndex />}
      </div>
    </Page>
  );
}
