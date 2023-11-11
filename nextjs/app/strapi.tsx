import qs from "qs";

import { STRAPI_ENDPOINT } from "../lib/constant";

export async function fetchStrapi(endpoint, query = {}) {
  const data = await fetch(
    STRAPI_ENDPOINT + "/api" + endpoint + "?" + qs.stringify(query)
  );
  if (!data.ok) {
    return undefined;
  }
  const data_json = await data.json();
  const flatten = flattenAttributes(
    data_json.data ? data_json.data : data_json
  );
  return flatten;
}

export function flattenAttributes(data: any): any {
  // Base case for recursion
  if (!data) return null;

  // Handling array data
  if (Array.isArray(data)) {
    return data.map(flattenAttributes);
  }

  let flattened: { [key: string]: any } = {};

  // Handling attributes
  if (data.attributes) {
    for (let key in data.attributes) {
      if (
        typeof data.attributes[key] === "object" &&
        data.attributes[key] !== null &&
        "data" in data.attributes[key]
      ) {
        flattened[key] = flattenAttributes(data.attributes[key].data);
      } else {
        flattened[key] = data.attributes[key];
      }
    }
  }

  // Copying non-attributes and non-data properties
  for (let key in data) {
    if (key !== "attributes" && key !== "data") {
      flattened[key] = data[key];
    }
  }

  // Handling nested data
  if (data.data) {
    flattened = { ...flattened, ...flattenAttributes(data.data) };
  }

  return flattened;
}
