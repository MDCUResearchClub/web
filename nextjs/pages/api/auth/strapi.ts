import { getSession } from "next-auth/client";
import { loginUser } from "../../../lib/strapi";

export default async (req, res) => {
  const session = await getSession({ req });
  console.log(session);
  if (session) {
    res.send(await loginUser(session.user));
  } else {
    res.status(401);
  }
  res.end();
};
