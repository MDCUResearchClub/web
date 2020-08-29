import { useState, useEffect } from "react";
import { useSession } from "next-auth/client";

const jwt = require("jsonwebtoken");

export const STRAPI_ENDPOINT =
  process.env.NODE_ENV === "production"
    ? "https://strapi.mdcuresearchclub.thew.pro"
    : "http://localhost:1337";

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

let cachedStrapiUser = {};

export function useStrapi(strapiUserProps) {
  const [session, sessionLoading] = useSession();

  if (strapiUserProps) {
    cachedStrapiUser = strapiUserProps;
  }
  const [strapiUser, setStrapiUser] = useState(cachedStrapiUser);

  function fetchStrapiAuth() {
    if (session) {
      return fetch("/api/auth/strapi")
        .then((res) => res.json())
        .then((strapiUser) => {
          setStrapiUser(strapiUser);
          cachedStrapiUser = strapiUser;
        });
    }
  }
  useEffect(() => {
    if (!strapiUser["jwt"]) {
      fetchStrapiAuth();
    } else if (strapiUser["jwt"]) {
      const jwtDecoded = strapiUser["jwtDecoded"];
      const timeout = setTimeout(
        fetchStrapiAuth,
        jwtDecoded.exp * 1000 - Date.now()
      );
      return () => clearTimeout(timeout);
    }
  });
  return strapiUser;
}
