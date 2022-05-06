import { fetchV3, postV4, publishV4 } from './common.mjs';

export async function migrateDepartments() {
    const data = await fetchV3("/departments")
    return Promise.all(data.map(department =>
        postV4("department.department", {
            title: department.title
        }).then(data => publishV4(`department.department/${data.id}`))
    ))
}
