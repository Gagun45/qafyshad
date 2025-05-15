import type { AdapterUser } from "next-auth/adapters";

declare module "next-auth" {
  interface Session {
    user: {
      email: string;
      isAdmin: boolean;
      name: string;
      contact: string;
    };
  }
  interface User extends AdapterUser {
    email: string;
    isAdmin: boolean;
  }
}
