import Fuse from "fuse.js";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { fetchStrapiServerSide } from "../lib/strapi";

const strapiData = {},
  strapiIndex = {};

async function getFuse(type: string, keys: string) {
  if (!strapiData[type]) {
    strapiData[type] = await fetchStrapiServerSide("/" + type);
    strapiIndex[type] = {};
  }
  if (!strapiIndex[type][keys]) {
    const keysArray = keys.split(",");
    strapiIndex[type][keys] = Fuse.createIndex(keysArray, strapiData[type]);
  }

  return new Fuse(
    strapiData[type],
    { includeMatches: true },
    strapiIndex[type][keys]
  );
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req });
  if (!session) {
    res.status(401);
    res.end();
    return;
  }

  const allowedQueryKeys = ["t", "k", "q"];
  const reqQueryKeys = Object.keys(req.query);
  if (
    !reqQueryKeys.every((key) => allowedQueryKeys.includes(key)) ||
    reqQueryKeys.length !== 3
  ) {
    res.status(400);
    res.end();
    return;
  }

  const strapiType = String(req.query.t);
  const fuseKeys = String(req.query.k);
  const query = String(req.query.q);

  if (
    !strapiType.match(/^[\w-]+$/) ||
    !fuseKeys.match(/^[\w-\.,]+$/) ||
    !query
  ) {
    res.status(400);
    res.end();
    return;
  }

  const fuse = await getFuse(strapiType, fuseKeys);
  const results = fuse.search(query);

  res.status(200).send(results);
};
