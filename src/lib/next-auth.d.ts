import type { AdapterSession } from "next-auth/adapters";

declare module "next-auth" {
  interface Session extends AdapterSession {
    user: {
      id: string;
      email: string;
      isAdmin: boolean;
      name: string;
      contact: string;
    };
  }
}
