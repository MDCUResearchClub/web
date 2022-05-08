import { fetchV3, getV4, postV4, publishV4 } from "./common.mjs";

export async function migrateDivisions() {
  const data = await fetchV3("/divisions");
  return Promise.all(
    data.map(async (division) => {
      const department = await getV4(
        `department.department?filters[$and][0][title][$eq]=${division.department.title}`
      );
      return postV4("division.division", {
        title: division.title,
        department: department.id,
      }).then((data) => publishV4(`division.division/${data.id}`));
    })
  );
}
