import useSWR, { SWRConfiguration } from "swr";
import { Buffer } from "buffer";
import { STRAPI_ENDPOINT } from "./constant";

function decodeJWT(jwt: string) {
  const payloadString = jwt.split(".")[1];
  return JSON.parse(Buffer.from(payloadString, "base64").toString("binary"));
}

interface SessionUser {
  name?: string;
  email?: string;
  image?: string;
}

export async function loginStrapiUser(user: SessionUser) {
  const strapiUser = await fetch(`${STRAPI_ENDPOINT}/api/nextjs/login`, {
    method: "POST",
    body: JSON.stringify({
      username: user.name,
      email: user.email,
    }),
    headers: {
      Authorization: `bearer ${process.env.STRAPI_TOKEN}`,
      "Content-Type": "application/json; charset=utf-8",
    },
  }).then((res) => {
    if (res.status !== 200) {
      throw res;
    }
    return res.json();
  });

  strapiUser.jwtDecoded = decodeJWT(strapiUser.jwt);

  return strapiUser;
}

function strapiDataFetcher(key: string | [endpoint: string, token: string]) {
  const headers = {};
  const endpoint = typeof key === "string" ? key : key[0];
  if (typeof key !== "string") {
    // Authenticated user
    headers["Authorization"] = `Bearer ${key[1]}`;
  }

  return fetch(`${STRAPI_ENDPOINT}/api${endpoint}`, {
    headers,
  }).then((res) => {
    if (res.ok) {
      return res.json();
    }
    throw res;
  });
}

export async function fetchStrapi(endpoint: string, init?: RequestInit) {
  return fetch(`${STRAPI_ENDPOINT}/api${endpoint}`, init);
}

type useStrapiOptions = {
  userOptions?: SWRConfiguration;
  dataOptions?: SWRConfiguration;
  requireAuth?: boolean;
  immutable?: boolean;
};

export function useStrapi(
  endpoint: string,
  {
    userOptions = {},
    dataOptions = {},
    requireAuth = false,
    immutable = false,
  }: useStrapiOptions = {}
) {
  function strapiUserFetcher(input: string) {
    return fetch(input).then(async (res) => {
      if (res.ok) {
        return res.json().catch(() => undefined);
      }
      throw res;
    });
  }

  if (immutable) {
    // Disable Automatic Revalidations https://swr.vercel.app/docs/revalidation#disable-automatic-revalidations
    userOptions.revalidateOnFocus = false;
    userOptions.revalidateIfStale = false;
    userOptions.revalidateOnReconnect = false;
    dataOptions.revalidateOnFocus = false;
    dataOptions.revalidateIfStale = false;
    dataOptions.revalidateOnReconnect = false;
  }

  const { data: user, error: userError } = useSWR(
    "/api/auth/strapi",
    strapiUserFetcher,
    {
      dedupingInterval: 6 * 60 * 60 * 1000, // 6 hours
      ...userOptions,
    }
  );

  let finalEndpoint;
  if (user && endpoint) {
    finalEndpoint = [endpoint, user["jwt"]];
  } else if (!requireAuth && endpoint) {
    finalEndpoint = endpoint;
  } else {
    finalEndpoint = null;
  }

  const { data, error: dataError } = useSWR(
    finalEndpoint,
    strapiDataFetcher,
    dataOptions
  );

  /**
   * Unified response format
   * data : the response data itself
   * meta (object): information about pagination, publication state, available locales, etc.
   * error (object, optional): information about any error thrown by the request
   */
  return { user, ...data, userError, dataError };
}

export function strapiImageLoader({
  src,
  width,
}: {
  src: string;
  width: number;
}) {
  let size;
  // https://github.com/strapi/strapi/blob/master/packages/strapi-plugin-upload/services/image-manipulation.js
  if (width <= 245) {
    size = "thumbnail";
  } else if (width <= 500) {
    size = "small";
  } else if (width <= 750) {
    size = "medium";
  } else {
    size = "large";
  }
  const lastSlash = src.lastIndexOf("/");
  const path = src.substring(0, lastSlash + 1);
  const filename = src.substring(lastSlash + 1);
  return `${STRAPI_ENDPOINT}${path}${size}_${filename}`;
}
