import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { Account, User as AuthUser } from "next-auth";
import User from "@/models/User";
import connect from "@/utils/db";
import bcrypt from "bcryptjs";

export const authOptions: any = {
  // Configure one or more authentication providers
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "Password" },
      },
      async authorize(credentials: any) {
        await connect();
        try {
          const user = await User.findOne({ email: credentials.email });
          console.log(user);
          if (user) {
            const isPassword = await bcrypt.compare(
              credentials.password,
              user.password
            );
            if (isPassword) {
              return user;
            }
          }
        } catch (err: any) {
          throw new Error(err);
        }
      },
    }),

    GithubProvider({
      clientId: process.env.GITHUB_ID ?? "",
      clientSecret: process.env.GITHUB_SECRET ?? "",
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),

    // ...add more providers here
  ],
};

export const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
