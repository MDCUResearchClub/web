import { fetchV3, postV4, publishV4 } from './common.mjs';

export async function migrateOpportunities() {
    const data = await fetchV3("/opportunities")
    return Promise.all(data.map(article =>
        postV4("opportunity.opportunity", {
            title: article.title,
            details: article.details,
        }).then(data => publishV4(`opportunity.opportunity/${data.id}`))
    ))
}