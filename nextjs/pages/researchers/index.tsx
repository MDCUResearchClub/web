import { useRouter } from "next/router";
import Link from "next/link";
import { useSession } from "next-auth/client";
import Page from "../../components/Page";
import Hero from "../../components/common/Hero";
import { useStrapi } from "../../lib/strapi";
import Card from "../../components/researcher/Card";
import Loading from "../../components/common/Loading";
import Details from "../../components/researcher/Details";

function DepartmentsIndex() {
  const {
    data: departments,
  }: { data: { title: string; id: number }[] } = useStrapi("/departments");
  const othersDepartment = departments
    ? departments.find((department) => !department.title)
    : null;
  return (
    <section>
      <h2 className="text-2xl mb-2">Departments</h2>
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-3">
        {!departments && <Loading colorClass="bg-blue-600" />}
        {departments &&
          departments
            .filter((department) => department.title)
            .map((department) => (
              <article
                className="text-center rounded border-2 border-blue-500 p-1"
                key={department.id}
              >
                <Link href={`?department=${department.id}`} passHref>
                  <a className="capitalize block">{department.title}</a>
                </Link>
              </article>
            ))}
        {othersDepartment && (
          <article
            className="text-center rounded border-2 border-blue-500 p-1"
            key={othersDepartment.id}
          >
            <Link href={`?department=${othersDepartment.id}`} passHref>
              <a className="capitalize block">Others</a>
            </Link>
          </article>
        )}
      </div>
    </section>
  );
}

function SearchResults() {
  const router = useRouter();
  const { data: department = [] } = useStrapi(
    router.query.department
      ? `/departments?id=${router.query.department}`
      : null
  );

  const division =
    department.length > 0
      ? department[0].divisions
          .map((division) => `division_in=${division.id}`)
          .join("&")
      : "";

  const { data: researchers } = useStrapi(
    router.query.department && division ? `/researchers?${division}` : null
  );

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
    router.query.department
      ? `/departments?id=${router.query.department}`
      : null
  );

  return (
    <section className="mb-4">
      {department.length > 0 && (
        <div>Department : {department[0].title || "Others"}</div>
      )}
    </section>
  );
}

export default function ResearchersPage() {
  const router = useRouter();
  const [session, loadingSession] = useSession();

  if (!session && !loadingSession) {
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
      </div>
    </Page>
  );
}
