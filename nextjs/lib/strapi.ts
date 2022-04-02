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
  const strapiUser = await fetch(`${STRAPI_ENDPOINT}/nextjs/login`, {
    method: "POST",
    body: JSON.stringify({
      username: user.name,
      email: user.email,
    }),
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      nextjs: process.env.STRAPI_TOKEN,
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

function strapiDataFetcher(endpoint: string, token?: string) {
  const headers = {};
  if (token) {
    // Authenticated user
    headers["Authorization"] = `Bearer ${token}`;
  }

  return fetch(`${STRAPI_ENDPOINT}${endpoint}`, {
    headers,
  }).then((res) => {
    if (res.ok) {
      return res.json();
    }
    throw res;
  });
}

export async function fetchStrapiServerSide(endpoint: string = "/users") {
  return fetch(`${STRAPI_ENDPOINT}${endpoint}`, {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      nextjs: process.env.STRAPI_TOKEN,
    },
  }).then((res) => {
    if (res.ok) {
      return res.json();
    }
    throw res;
  });
}

export async function fetchStrapiPublic(endpoint: string) {
  return await fetch(`${STRAPI_ENDPOINT}${endpoint}`);
}

type useStrapiOptions = {
  userOptions?: SWRConfiguration;
  dataOptions?: SWRConfiguration;
  isPublic?: boolean;
  immutable?: boolean;
};

export function useStrapi(
  endpoint: string = "/users/me",
  {
    userOptions = {},
    dataOptions = {},
    isPublic = false,
    immutable = false,
  }: useStrapiOptions = {}
) {
  function strapiUserFetcher(input: string, init?) {
    return fetch(input, init).then(async (res) => {
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
      dedupingInterval: 5 * 60 * 1000, // 5 mins
      ...userOptions,
    }
  );

  let finalEndpoint;
  if (user && endpoint) {
    finalEndpoint = [endpoint, user["jwt"]];
  } else if (isPublic && endpoint) {
    finalEndpoint = endpoint;
  } else {
    finalEndpoint = null;
  }

  const { data, error: dataError } = useSWR(
    finalEndpoint,
    strapiDataFetcher,
    dataOptions
  );

  return { user, data, userError, dataError };
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
