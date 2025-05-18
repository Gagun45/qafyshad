import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { dbConnect } from "./dbconnect";
import { User } from "./models";
import { Types } from "mongoose";
import { hashPassword, verifyPassword } from "./hashPassword";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google,
    CredentialsProvider({
      async authorize(credentials) {
        try {
          await dbConnect();
          const user = await User.findOne({
            email: credentials.email,
          });

          if (!verifyPassword(credentials.password as string, user.password)) {
            return null;
          }

          return {
            email: user.email,
          };
        } catch {
          console.log("Authorize error");
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const dbUser = await User.findOne({ email: user.email });
        if (dbUser) {
          token.sub = dbUser._id.toString();
        }
      }
      return token;
    },
    async session({ session, token }) {
      await dbConnect();
      const dbUser = await User.findOne({
        _id: new Types.ObjectId(token.sub as string),
      });

      const filteredSession = {
        ...session,
        user: {
          id: dbUser.id,
          email: dbUser.email,
          isAdmin: dbUser.isAdmin,
          name: dbUser.name,
          contact: dbUser.contact,
          serverField: dbUser.email + dbUser.name,
        },
      };
      return filteredSession;
    },
    async signIn({ user }) {
      try {
        await dbConnect();
        let existingUser = await User.findOne({ email: user.email });
        if (!existingUser) {
          const password = hashPassword(
            crypto.randomUUID().slice(0, 8).toUpperCase()
          );
          existingUser = await User.create({
            email: user.email,
            password,
            name: user.name,
          });
        }
        return true;
      } catch {
        console.log("Sign in callback error");
        return false;
      }
    },
  },
});
