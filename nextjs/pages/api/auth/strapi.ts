import { getSession } from "next-auth/client";
import { loginStrapiUser } from "../../../lib/strapi";

export default async (req, res) => {
  const session = await getSession({ req });
  if (session) {
    res.send(await loginStrapiUser(session.user));
  } else {
    res.send({});
  }
  res.end();
};
