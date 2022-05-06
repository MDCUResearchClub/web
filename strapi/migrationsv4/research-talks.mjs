import { fetchV3, postV4, publishV4 } from './common.mjs';

export async function migratResearchTalks() {
    const data = await fetchV3("/research-talks")
    return Promise.all(data.map(article =>
        postV4("research-talk.research-talk", {
            title: article.title,
            description: article.description,
            youtubeID: article.youtubeID,
        }).then(data => publishV4(`research-talk.research-talk/${data.id}`))
    ))
}
