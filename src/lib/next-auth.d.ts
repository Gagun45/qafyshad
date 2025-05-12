import type { AdapterUser } from "next-auth/adapters";

declare module "next-auth" {
  interface Session {
    user: {
      email: string;
      isAdmin: boolean;
    };
  }
  interface User extends AdapterUser {
    email: string;
    isAdmin: boolean;
  }
}
