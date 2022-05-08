import { fetchV3, postV4, publishV4 } from "./common.mjs";

export async function migrateKeywords() {
  const data = await fetchV3("/keywords/count");
  for (let i = 0; i < data; i = i + 100) {
    const data = await fetchV3(`/keywords?_start=${i}&_limit=100`);
    await Promise.all(
      data.map((keyword) =>
        postV4("keyword.keyword", {
          title: keyword.title,
        }).then((data) => publishV4(`keyword.keyword/${data.id}`))
      )
    );
  }
}
