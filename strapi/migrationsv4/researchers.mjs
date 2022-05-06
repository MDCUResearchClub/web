import { fetchV3, postV4, publishV4, getV4 } from './common.mjs';

export async function migrateResearchers() {
    const data = 1// await fetchV3("/researchers/count")
    for (let i = 0; i < data; i = i + 100) {
        const data = await fetchV3(`/researchers?_start=${i}&_limit=100`)
        await Promise.all(data.map(async researcher => {

            const keywords = (await Promise.all(researcher.keywords.map(keyword =>
                getV4(`keyword.keyword?filters[$and][0][title][$eq]=${encodeURIComponent(keyword.title)}`)
            ))).map(keyword => keyword.id)

            const departmentTitle = (await fetchV3(`/departments/${researcher.division.department}`)).title
            const division = await getV4(`division.division?filters[$and][0][department][title][$eq]=${encodeURIComponent(departmentTitle)}&filters[$and][1][title][$eq]=${encodeURIComponent(researcher.division.title)}`)


            return postV4("researcher.researcher", {
                emails: researcher.emails.map(email => ({ email: email.email })),
                fullname_en: researcher.fullname_en,
                fullname_th: researcher.fullname_th,
                links: researcher.links.map(link => ({ title: link.title, url: link.url })),
                position_en: researcher.position_en,
                position_th: researcher.position_th,
                suffix: researcher.suffix,
                title: researcher.title,
                division: division.id,
                keywords,
            }).then(data => publishV4(`researcher.researcher/${data.id}`))
        }
        ))
    }
}

