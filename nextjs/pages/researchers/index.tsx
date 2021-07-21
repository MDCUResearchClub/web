import { useRouter } from "next/router"
import { useSession } from "next-auth/client"
import Page from "../../components/Page"
import Hero from "../../components/common/Hero"
import { useStrapi } from "../../lib/strapi"
import Card from "../../components/researcher/Card"
import Loading from "../../components/common/Loading"
import Details from "../../components/researcher/Details"
import {
  DepartmentsIndex,
  KeywordsIndex,
} from "../../components/researcher/Index"

function SearchResults() {
  const router = useRouter()
  const { data: department = [] } = useStrapi(
    router.query.department
      ? `/departments?id=${router.query.department}`
      : null
  )

  const division =
    department.length > 0
      ? department[0].divisions
          .map((division) => `division_in=${division.id}`)
          .join("&")
      : ""

  const { data: departmentResearchers } = useStrapi(
    router.query.department && division ? `/researchers?${division}` : null
  )

  const { data: keywordResearchers } = useStrapi(
    router.query.keyword
      ? `/researchers?keywords=${router.query.keyword}`
      : null
  )

  const researchers = router.query.department
    ? departmentResearchers
    : keywordResearchers

  console.log(keywordResearchers)

  if (researchers === undefined) {
    return <Loading colorClass="bg-blue-600" />
  }

  if (researchers.length === 0) {
    return null
  }

  const activeId = router.query.detail || researchers[0].id
  const activeResearcher = researchers.find(
    (researcher) => activeId == researcher.id
  )
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
  )
}

function SearchBox() {
  const router = useRouter()
  const { data: department = [] } = useStrapi(
    router.query.department
      ? `/departments?id=${router.query.department}`
      : null
  )

  const { data: keyword = [] } = useStrapi(
    router.query.keyword ? `/keywords?id=${router.query.keyword}` : null
  )

  return (
    <section className="mb-4 text-xl font-bold text-center">
      {department.length > 0 && (
        <div className="text-blue-800">
          Department : {department[0].title || "Others"}
        </div>
      )}
      {keyword.length > 0 && (
        <div>Keyword : {keyword[0].title || "Others"}</div>
      )}
    </section>
  )
}

export default function ResearchersPage() {
  const router = useRouter()
  const [session, loadingSession] = useSession()

  if (!session && !loadingSession) {
    return (
      <Page title="Researchers">
        <Hero
          heading={["Researchers are", "for members."]}
          image="/images/peep1.svg"
          ctaText="Loading..."
        />
      </Page>
    )
  }
  const haveQuery = Object.keys(router.query).length > 0
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
  )
}
