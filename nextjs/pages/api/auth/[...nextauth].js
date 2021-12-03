import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const HOSTED_DOMAIN = "docchula.com";

const options = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      authorization: {
        url: "https://accounts.google.com/o/oauth2/auth?response_type=code",
        params: {
          hd: HOSTED_DOMAIN,
        },
      },
    }),
  ],
  callbacks: {
    signIn: async ({ account, profile }) => {
      if (
        account.provider === "google" &&
        profile.email_verified === true &&
        profile.email.endsWith(`@${HOSTED_DOMAIN}`)
      ) {
        return Promise.resolve(true);
      } else {
        return Promise.resolve(false);
      }
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default (req, res) => NextAuth(req, res, options);
