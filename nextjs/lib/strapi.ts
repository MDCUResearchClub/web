import { useEffect } from "react";
import useSWR from "swr";
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
    if (!res.ok) {
      throw res;
    }
    return res.json();
  });
}

export async function fetchStrapiServerSide(endpoint: string = "/users") {
  return fetch(`${STRAPI_ENDPOINT}${endpoint}`, {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      nextjs: process.env.STRAPI_TOKEN,
    },
  }).then((res) => {
    if (!res.ok) {
      throw res;
    }
    return res.json();
  });
}

export async function fetchStrapiPublic(endpoint: string) {
  return await fetch(`${STRAPI_ENDPOINT}${endpoint}`);
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
