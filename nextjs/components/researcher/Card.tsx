import Link from "next/link";
import { useRouter } from "next/router";
import { useStrapi } from "../../lib/strapi";

export default function Card({ researcher, active = false }) {
  const router = useRouter();
  const { data: department = [] } = useStrapi(
    researcher?.division?.department
      ? `/departments/${researcher.division.department}`
      : null
  );

  const href = {
    pathname: router.pathname,
    query: { ...router.query, detail: researcher.id },
  };

  const isMobile = window && window.innerWidth < 768;
  return (
    <Link href={href} scroll={isMobile}>
      <article
        className={`p-4 rounded ${
          active ? "md:border-blue-600 md:border-4" : ""
        } border-blue-400 border-2 hover:border-blue-500 flex justify-between cursor-pointer`}
      >
        <Link href={href} passHref scroll={isMobile}>
          <a href="">
            {researcher.attributes.fullname_en ? (
              <div>
                <div className="font-medium">
                  {researcher.attributes.fullname_en}
                </div>
                <div className="opacity-75 text-sm">
                  {researcher.attributes.fullname_th}
                </div>
              </div>
            ) : (
              <div className="text-lg font-medium">
                {researcher.attributes.fullname_th}
              </div>
            )}
          </a>
        </Link>
        <div className="capitalize text-right">
          <div className="font-medium">
            {department.length > 0 && department[0].attributes.title}
          </div>
          <div className="opacity-75 text-sm">
            {researcher.division?.attributes.title}
          </div>
        </div>
      </article>
    </Link>
  );
}
