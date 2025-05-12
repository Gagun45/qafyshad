import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { dbConnect } from "./dbconnect";
import { User } from "./models";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google,
    CredentialsProvider({
      async authorize(credentials) {
        try {
          await dbConnect();
          const user = await User.findOne({ email: credentials.email });

          return {
            email: user.email,
            isAdmin: user.isAdmin,
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
        token.isAadmin = user.isAdmin;
        token.email = user.email;
      }
      return token;
    },
    async session({ session }) {
      await dbConnect();

      const dbUser = await User.findOne({ email: session.user.email });

      const filteredSession = {
        ...session,
        user: {
          email: dbUser.email,
          isAdmin: dbUser.isAdmin,
        },
      };
      return filteredSession;
    },
    async signIn({ user }) {
      try {
        await dbConnect();
        const existingUser = await User.findOne({ email: user.email });
        if (!existingUser) {
          const password = crypto.randomUUID().slice(0, 8).toUpperCase();
          await User.create({
            email: user.email,
            password,
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
