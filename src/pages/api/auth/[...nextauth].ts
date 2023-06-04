import { compare } from "bcryptjs";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "../../../lib/prisma";
import type { NextAuthOptions } from "next-auth";

export const nextAuthOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 365 * 24 * 60 * 60,
  },
  secret: "Ma9lhjb4vuauNHVvLsdPlwFtarlGMO3To50kktg/5PU=",
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "email@mail.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        const result = await prisma.user.findFirst({
          where: {
            email: credentials?.email || "",
          },
        });

        if (!result) {
          throw new Error("No user found!");
        }

        const checkPassword = await compare(
          credentials?.password || "",
          result.password
        );

        if (!checkPassword) {
          throw new Error("Password not matched!");
        }

        return {
          id: result.id,
          email: result.email,
          name: result.name,
        };
      },
    }),
  ],
  callbacks: {
    async session({ session, user, token }) {
      const result = await prisma.user.findFirst({
        where: {
          email: session.user?.email || "",
        },
      });

      if (!result) {
        return {
          ...session,
        };
      }

      const permissions = await prisma.userPermissions.findMany({
        where: {
          userId: result.id,
        },
      });

      return {
        ...session,
        user: {
          id: result.id,
          email: result.email,
          name: result.name,
          permissions: permissions.map((m) => m.policyKey),
        },
      };
    },
  },
};

export default NextAuth(nextAuthOptions);
