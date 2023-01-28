import { GetStaticProps } from "next";
import Link from "next/link";
import { useRouter } from "next/router";

import Page from "../../components/Page";
import { useStrapi, fetchStrapi } from "../../lib/strapi";

const dateFormat = new Intl.DateTimeFormat("th", {
  dateStyle: "medium",
});

function OpportunitiesIndex({
  availableOpportunitiesData,
  completedOpportunitiesData,
}) {
  const router = useRouter();
  const { data: availableOpportunities } = useStrapi(
    "/opportunities?filters[status][$eq]=available",
    {
      dataOptions: { fallbackData: availableOpportunitiesData },
    }
  );
  const { data: completedOpportunities } = useStrapi(
    "/opportunities?filters[status][$eq]=completed",
    {
      dataOptions: { fallbackData: completedOpportunitiesData },
    }
  );

  let availableRows;
  if (availableOpportunities.length > 0) {
    availableRows = (
      <>
        <tr>
          <td
            className="border-2 border-slate-900 bg-lime-300 p-2 font-bold"
            colSpan={3}
          >
            Available
          </td>
        </tr>
        {availableOpportunities.map((opportunity) => (
          <tr
            className="cursor-pointer hover:bg-lime-100"
            onClick={() => router.push(`/opportunities/${opportunity.id}`)}
          >
            <td className="border-2 border-slate-900 p-2 pl-4">
              <Link href={`/opportunities/${opportunity.id}`}>
                {opportunity.attributes.title}
              </Link>
            </td>
            <td className="border-2 border-slate-900 p-2">
              {opportunity.attributes.department}
            </td>
            <td className="border-2 border-slate-900 p-2 whitespace-nowrap">
              {dateFormat.format(new Date(opportunity.attributes.deadline))}
            </td>
          </tr>
        ))}
      </>
    );
  }

  let completedRows;
  if (completedOpportunities.length > 0) {
    completedRows = (
      <>
        <tr>
          <td
            className="border-2 border-slate-900 bg-rose-300 p-2 font-bold"
            colSpan={3}
          >
            Completed
          </td>
        </tr>
        {completedOpportunities.map((opportunity) => (
          <tr
            className="cursor-pointer hover:bg-rose-100"
            onClick={() => router.push(`/opportunities/${opportunity.id}`)}
          >
            <td className="border-2 border-slate-900 p-2 pl-4">
              <Link href={`/opportunities/${opportunity.id}`}>
                {opportunity.attributes.title}
              </Link>
            </td>
            <td className="border-2 border-slate-900 p-2">
              {opportunity.attributes.department}
            </td>
            <td className="border-2 border-slate-900 p-2 whitespace-nowrap">
              {dateFormat.format(new Date(opportunity.attributes.deadline))}
            </td>
          </tr>
        ))}
      </>
    );
  }

  return (
    <table className="w-full max-w-screen-lg mx-auto border-collapse border-4 border-slate-900">
      <thead>
        <tr>
          <th className="border-4 border-slate-900 p-2">Project</th>
          <th className="border-4 border-slate-900 p-2">Department</th>
          <th className="border-4 border-slate-900 p-2">Deadline</th>
        </tr>
      </thead>
      <tbody>
        {availableRows}
        {completedRows}
      </tbody>
    </table>
  );
}

export default function OpportunitiesPage({
  availableOpportunitiesData,
  completedOpportunitiesData,
}) {
  return (
    <Page title="Opportunity">
      <div className="px-2 md:px-4 lg:px-16 container mx-auto py-4">
        <h1 className="font-serif text-3xl mb-4 text-center">
          Research Opportunity
        </h1>
        <OpportunitiesIndex
          availableOpportunitiesData={availableOpportunitiesData}
          completedOpportunitiesData={completedOpportunitiesData}
        />
      </div>
    </Page>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const availableOpportunitiesData = await fetchStrapi(
    "/opportunities?filters[status][$eq]=available"
  ).then((res) => (res.ok ? res.json() : null));
  const completedOpportunitiesData = await fetchStrapi(
    "/opportunities?filters[status][$eq]=completed"
  ).then((res) => (res.ok ? res.json() : null));

  return {
    props: {
      availableOpportunitiesData,
      completedOpportunitiesData,
    },
  };
};
