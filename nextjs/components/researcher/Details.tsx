import { Children } from "react"
import Link from "next/link"
import { useRouter } from "next/router"
import { useStrapi } from "../../lib/strapi"

function Box({ heading, children }) {
  if (Children.count(children) === 0) {
    return null
  }
  return (
    <section className="border border-indigo-300 p-4 mb-4">
      <h3 className="text-lg font-medium mb-2">{heading}</h3>
      <ul className="text-blue-800 underline space-y-2 max-h-32 overflow-auto">
        {children}
      </ul>
    </section>
  )
}

export default function Details({ researcher }) {
  const router = useRouter()
  const engName = `${researcher.position_en} ${researcher.fullname_en} ${researcher.suffix}`
  const thaiName = `${researcher.position_th}${
    researcher.position_th.endsWith(".") ? "" : " "
  }${researcher.title}${researcher.fullname_th}`
  const name = (
    <div className="mb-2">
      {researcher.fullname_en ? (
        <div>
          <h1 className="font-medium text-xl">{engName}</h1>
          <div className="opacity-75">{thaiName}</div>
        </div>
      ) : (
        <h1 className="text-xl font-medium ">{thaiName}</h1>
      )}
    </div>
  )

  const { data: departmentData } = useStrapi(
    `/departments?id=${researcher.division.department}`
  )

  const division = (
    <section className="capitalize mb-2">
      {departmentData && (departmentData[0].title || "Others")}
      {researcher.division.title && ` (${researcher.division.title})`}
    </section>
  )

  const emails = (
    <Box heading="Emails">
      {researcher.emails.map((email) => (
        <li key={email.id}>
          <a href={`mailto:${email.email}`}>{email.email}</a>
        </li>
      ))}
    </Box>
  )

  const links = (
    <Box heading="Links">
      {researcher.links
        .filter((link) => link.title !== "image")
        .map((link) => (
          <li key={link.id}>
            <a href={link.url}>{link.title}</a>
          </li>
        ))}
    </Box>
  )

  const keywords = (
    <Box heading="Keywords">
      {researcher.keywords.map((keyword) => (
        <li key={keyword.id}>
          <Link
            href={{
              pathname: router.pathname,
              query: { keyword: keyword.id },
            }}
            passHref
          >
            <a>{keyword.title}</a>
          </Link>
        </li>
      ))}
    </Box>
  )

  return (
    <article>
      {name}
      {division}
      {emails}
      {links}
      {keywords}
    </article>
  )
}
