import NextAuth from "next-auth";
import Providers from "next-auth/providers";

const HOSTED_DOMAIN = "docchula.com";

const options = {
  providers: [
    Providers.Google({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      authorizationUrl: `https://accounts.google.com/o/oauth2/auth?response_type=code&hd=${HOSTED_DOMAIN}`,
    }),
  ],
  callbacks: {
    signIn: async (user, account, profile) => {
      if (
        account.provider === "google" &&
        profile.verified_email === true &&
        profile.email.endsWith(`@${HOSTED_DOMAIN}`)
      ) {
        return Promise.resolve(true);
      } else {
        return Promise.resolve(false);
      }
    },
  },
};

export default (req, res) => NextAuth(req, res, options);
