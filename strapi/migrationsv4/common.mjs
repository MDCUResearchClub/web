import fetch from 'node-fetch';

export const TOKEN_V3 = process.env.STRAPI_TOKEN_V3;
export const TOKEN_V4 = process.env.STRAPI_TOKEN_V4;
export const ENDPOINT_V3 = process.env.STRAPI_ENDPOINT_V3;
export const ENDPOINT_V4 = process.env.STRAPI_ENDPOINT_V4;

export function fetchV3(path) {
    return fetch(`${ENDPOINT_V3}${path}`, { headers: { authorization: TOKEN_V3 } }).then(res => res.json())
}

export function postV4(path, data) {
    return fetch(`${ENDPOINT_V4}/content-manager/collection-types/api::${path}`, {
        method: "POST", headers: { Authorization: TOKEN_V4, 'Content-Type': 'application/json' }, body: JSON.stringify(data)
    }).then(res => res.json())
}

export function getV4(path) {
    return fetch(`${ENDPOINT_V4}/content-manager/collection-types/api::${path}`, {
        headers: { Authorization: TOKEN_V4 }
    }).then(res => res.json()).then(data => data.results[0])
}

export function publishV4(path) {
    return fetch(`${ENDPOINT_V4}/content-manager/collection-types/api::${path}/actions/publish`, {
        method: "POST", headers: { Authorization: TOKEN_V4 }
    }).then(res => res.json())
}
