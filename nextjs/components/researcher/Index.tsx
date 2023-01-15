import Link from "next/link";
import { useStrapi } from "../../lib/strapi";
import Loading from "../common/Loading";

export function DepartmentsIndex() {
  const {
    data: departments,
  }: { data: { attributes: { title: string }; id: number }[] } =
    useStrapi("/departments");
  const othersDepartment = departments
    ? departments.find((department) => !department.attributes.title)
    : null;
  return (
    <section className="mb-8">
      <h2 className="text-2xl mb-2">Departments</h2>
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-3">
        {!departments && <Loading colorClass="bg-blue-600" />}
        {departments &&
          departments
            .filter((department) => department.attributes.title)
            .map((department) => (
              <article
                className="text-center rounded border-2 border-blue-700 p-1"
                key={department.id}
              >
                <Link
                  href={`?department=${department.id}`}
                  className="capitalize block"
                >
                  {department.attributes.title}
                </Link>
              </article>
            ))}
        {othersDepartment && (
          <article
            className="text-center rounded border-2 border-blue-700 p-1"
            key={othersDepartment.id}
          >
            <Link
              href={`?department=${othersDepartment.id}`}
              passHref
              className="capitalize block"
            >
              Others
            </Link>
          </article>
        )}
      </div>
    </section>
  );
}

export function KeywordsIndex() {
  const {
    data: keywords,
  }: { data: { attributes: { title: string }; id: number }[] } = useStrapi(
    "/keywords/top?pagination[limit]=100"
  );
  return (
    <section className="mb-8">
      <h2 className="text-2xl mb-2">Keywords</h2>
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-3">
        {!keywords && <Loading colorClass="bg-blue-600" />}
        {keywords &&
          keywords
            .filter((keyword) => keyword.attributes.title)
            .map((keyword) => (
              <article
                className="text-center rounded border-2 p-1"
                key={keyword.id}
              >
                <Link
                  href={`?keyword=${keyword.id}`}
                  passHref
                  className="capitalize block"
                >
                  {keyword.attributes.title}
                </Link>
              </article>
            ))}
      </div>
    </section>
  );
}
