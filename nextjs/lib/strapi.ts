import { useEffect } from "react";
import useSWR from "swr";
import jwt from "jsonwebtoken";
import { STRAPI_ENDPOINT } from "./constant";
interface SessionUser {
  name?: string;
  email?: string;
  image?: string;
}

interface StrapiUser {
  id: Number;
  username: String;
  email: String;
}

interface StrapiNextjsUser {
  jwt: string;
  user: StrapiUser;
  jwtDecoded: any;
}

let CACHED_NextjsUser = null;

async function loginNextjs(): Promise<StrapiNextjsUser> {
  function fetchNextjsUser() {
    return fetch(`${STRAPI_ENDPOINT}/auth/local`, {
      method: "POST",
      body: JSON.stringify({
        identifier: "nextjs@mdcuresearchclub.thew.pro",
        password: process.env.STRAPI_PASSWORD,
      }),
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
    }).then((res) => {
      if (res.status !== 200) {
        throw res;
      }
      return res.json();
    });
  }

  if (
    CACHED_NextjsUser &&
    CACHED_NextjsUser.jwtDecoded.exp * 1000 > Date.now()
  ) {
    return Promise.resolve(CACHED_NextjsUser);
  }

  const nextjsUser: StrapiNextjsUser = await fetchNextjsUser();

  nextjsUser.jwtDecoded = jwt.decode(nextjsUser.jwt);

  CACHED_NextjsUser = nextjsUser;

  return nextjsUser;
}

export async function loginStrapiUser(user: SessionUser) {
  const nextjsUser = await loginNextjs();

  const strapiUser = await fetch(`${STRAPI_ENDPOINT}/nextjs/login`, {
    method: "POST",
    body: JSON.stringify({
      username: user.name,
      email: user.email,
    }),
    headers: {
      Authorization: `Bearer ${nextjsUser.jwt}`,
      "Content-Type": "application/json; charset=utf-8",
    },
  }).then((res) => res.json());

  strapiUser.jwtDecoded = jwt.decode(strapiUser.jwt);

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
    if (!res.ok) {
      throw res;
    }
    return res.json();
  });
}

export async function fetchStrapiServerSide(endpoint: string = "/users") {
  const nextjsUser = await loginNextjs();

  return strapiDataFetcher(endpoint, nextjsUser.jwt);
}

export async function fetchStrapiPublic(endpoint: string) {
  return fetch(`${STRAPI_ENDPOINT}${endpoint}`);
}

export function useStrapi(endpoint: string = "/users/me", swrOptions?) {
  function strapiUserFetcher(input: string, init?) {
    return fetch(input, init).then((res) => {
      if (res.status === 200) {
        return res.json();
      } else {
        throw res;
      }
    });
  }

  const {
    data: strapiUser,
    error: userError,
    mutate: mutateUser,
  } = useSWR("/api/auth/strapi", strapiUserFetcher, {
    dedupingInterval: 5 * 60 * 1000, // 5 mins
  });

  const { data, error: dataError } = useSWR(
    strapiUser && endpoint ? [endpoint, strapiUser["jwt"]] : null,
    strapiDataFetcher,
    swrOptions
  );

  useEffect(() => {
    if (strapiUser?.["jwt"]) {
      const jwtDecoded = strapiUser["jwtDecoded"];
      const timeout = setTimeout(
        () => mutateUser(),
        jwtDecoded.exp * 1000 - Date.now()
      );
      return () => clearTimeout(timeout);
    }
  });

  return { strapiUser, data, userError, dataError };
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
