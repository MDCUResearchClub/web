import { useEffect, useRef } from "react";
import useSWR, { mutate } from "swr";
import jwt from "jsonwebtoken";

interface StrapiUser {
  id: Number;
  username: String;
  email: String;
}

interface StrapiNextjsUser {
  jwt: string;
  user: StrapiUser;
}

export const STRAPI_ENDPOINT = "https://strapi.mdcuresearchclub.thew.pro";

function loginNextjs(): Promise<StrapiNextjsUser> {
  return fetch(`${STRAPI_ENDPOINT}/auth/local`, {
    method: "POST",
    body: JSON.stringify({
      identifier: "nextjs@mdcuresearchclub.thew.pro",
      password: process.env.STRAPI_PASSWORD,
    }),
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
  }).then((res) => res.json());
}

export async function loginStrapiUser(user) {
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

function strapiDataFetcher(endpoint: string, token: string) {
  if (!endpoint) {
    throw "No endpoint";
  }
  if (!token) {
    throw "No token";
  }

  return fetch(`${STRAPI_ENDPOINT}${endpoint}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then((res) => res.json());
}

export async function fetchStrapiServerSide(endpoint = "/users") {
  const nextjsUser = await loginNextjs();

  return strapiDataFetcher(endpoint, nextjsUser.jwt);
}

export function useStrapi(endpoint = "/users/me") {
  function strapiUserFetcher(input, init?) {
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
    strapiUserFetcher
  );

  const { data, error: dataError } = useSWR(
    [endpoint, strapiUser?.["jwt"]],
    strapiDataFetcher
  );

  const dataRef = useRef(data);

  dataRef.current = data === undefined ? dataRef.current : data;

  useEffect(() => {
    if (strapiUser?.["jwt"]) {
      const jwtDecoded = strapiUser["jwtDecoded"];
      const timeout = setTimeout(() => {
        mutate("/api/auth/strapi");
      }, jwtDecoded.exp * 1000 - Date.now());
      return () => clearTimeout(timeout);
    }
  });

  return { strapiUser, data: dataRef.current, userError, dataError };
}
