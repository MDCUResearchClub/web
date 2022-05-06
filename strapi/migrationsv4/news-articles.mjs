import { fetchV3, postV4, publishV4 } from './common.mjs';

export async function migrateNewsArticles() {
    const data = await fetchV3("/news-articles")
    return Promise.all(data.map(article =>
        postV4("news-article.news-article", {
            title: article.title,
            description: article.description,
            body: article.body,
        }).then(data => publishV4(`news-article.news-article/${data.id}`))
    ))
}
