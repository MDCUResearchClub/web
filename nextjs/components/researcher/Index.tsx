import Link from "next/link"
import { useStrapi } from "../../lib/strapi"
import Loading from "../common/Loading"

export function DepartmentsIndex() {
  const { data: departments }: { data: { title: string; id: number }[] } =
    useStrapi("/departments")
  const othersDepartment = departments
    ? departments.find((department) => !department.title)
    : null
  return (
    <section className="mb-8">
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
  )
}

export function KeywordsIndex() {
  const { data: keywords }: { data: { title: string; id: number }[] } =
    useStrapi("/keywords/top")
  return (
    <section className="mb-8">
      <h2 className="text-2xl mb-2">Keywords</h2>
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-3">
        {!keywords && <Loading colorClass="bg-blue-600" />}
        {keywords &&
          keywords
            .filter((keyword) => keyword.title)
            .map((keyword) => (
              <article
                className="text-center rounded border-2 p-1"
                key={keyword.id}
              >
                <Link href={`?keyword=${keyword.id}`} passHref>
                  <a className="capitalize block">{keyword.title}</a>
                </Link>
              </article>
            ))}
      </div>
    </section>
  )
}
