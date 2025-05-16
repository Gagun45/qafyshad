'use server'

import { Types } from "mongoose";
import { auth } from "./auth";
import { dbConnect } from "./dbconnect";
import { User } from "./models";
import type { ServerSession } from "./next-auth";

export const getServerSession = async (): Promise<ServerSession | null> => {
  const session = await auth();
  if (!session || !session.user || !("id" in session.user)) {
    return null;
  }
  return session as unknown as ServerSession;
};

export const getUserById = async (id: string) => {
  try {
    await dbConnect();
    const user = await User.findById(new Types.ObjectId(id));
    return user;
  } catch {
    return null;
  }
};