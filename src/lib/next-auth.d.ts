declare module "next-auth" {
  interface Session {
    user: {
      email: string;
      isAdmin: boolean;
      name: string;
      contact: string;
    };
  }
}
export interface ServerSession {
  user: {
    id: string;
    email: string;
    isAdmin: boolean;
    name: string;
    contact: string;
  };
}
