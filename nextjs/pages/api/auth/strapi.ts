import { getSession } from "next-auth/react";
import { loginStrapiUser } from "../../../lib/strapi";

export default async (req, res) => {
  const session = await getSession({ req });
  if (session) {
    try {
      const user = await loginStrapiUser(session.user);
      res.send(user);
    } catch (error) {
      if (error.status) {
        // Error from fetch Response
        res.status(error.status).send(await error.json());
      } else {
        // Other error
        res.status(500).send(error.message);
      }
    }
  } else {
    res.send({});
  }
};
