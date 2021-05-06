import Link from "next/link";
import { useRouter } from "next/router";
import { useStrapi } from "../../lib/strapi";

export default function Card({ researcher, active=false }) {
  const router = useRouter();
  const { data: department = [] } = useStrapi(
    researcher?.division?.department
      ? `/departments?id=${researcher.division.department}`
      : null
  );

  const href = {
    pathname: router.pathname,
    query: { ...router.query, detail: researcher.id },
  };
  return (
    <Link href={href} scroll={false}>
      <article className={`p-4 rounded ${active ? "border-blue-600 border-4" : "border-blue-400 border-2"} hover:border-blue-500 flex justify-between cursor-pointer`}>
        <Link href={href} passHref scroll={false}>
          <a href="">
            {researcher.fullname_en ? (
              <div>
                <div className="font-medium">{researcher.fullname_en}</div>
                <div className="opacity-75 text-sm">
                  {researcher.fullname_th}
                </div>
              </div>
            ) : (
              <div className="text-lg font-medium">
                {researcher.fullname_th}
              </div>
            )}
          </a>
        </Link>
        <div className="capitalize text-right">
          <div className="font-medium">
            {department.length > 0 && department[0].title}
          </div>
          <div className="opacity-75 text-sm">{researcher.division.title}</div>
        </div>
      </article>
    </Link>
  );
}
