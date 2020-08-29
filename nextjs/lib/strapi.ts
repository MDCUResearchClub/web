import { useEffect } from "react";
import useSWR, { mutate } from "swr";
import jwt from "jsonwebtoken";

export const STRAPI_ENDPOINT = "https://strapi.mdcuresearchclub.thew.pro";

export async function loginUser(user) {
  const nextjsUser = await fetch(`${STRAPI_ENDPOINT}/auth/local`, {
    method: "POST",
    body: JSON.stringify({
      identifier: "nextjs@mdcuresearchclub.thew.pro",
      password: process.env.STRAPI_PASSWORD,
    }),
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
  }).then((res) => res.json());

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

export function useStrapi(endpoint = "/users/me") {
  function fetcher(input, init?) {
    return fetch(input, init).then((res) => {
      if (res.status === 200) {
        return res.json();
      } else if (res.status === 401) {
        return null;
      } else {
        throw res;
      }
    });
  }

  const { data: strapiUser, error: userError } = useSWR(
    "/api/auth/strapi",
    fetcher
  );

  function dataFetcher(endpoint, token) {
    if (!token) {
      throw "No token";
    }
    return fetcher(endpoint, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  const { data, error: dataError } = useSWR(
    [`${STRAPI_ENDPOINT}${endpoint}`, strapiUser?.["jwt"]],
    dataFetcher
  );

  useEffect(() => {
    if (strapiUser?.["jwt"]) {
      const jwtDecoded = strapiUser["jwtDecoded"];
      const timeout = setTimeout(() => {
        mutate("/api/auth/strapi");
      }, jwtDecoded.exp * 1000 - Date.now());
      return () => clearTimeout(timeout);
    }
  });
  return { strapiUser, data, userError, dataError };
}
