'use server'

import mongoose from "mongoose";

interface ConInt {
  isConnected: boolean;
}

const connection: ConInt = { isConnected: false };

export const dbConnect = async () => {
  try {
    if (connection.isConnected) {
      console.log("Using existing connection");
      return;
    }
    await mongoose.connect(process.env.MONGODB as string);
    connection.isConnected = true;
  } catch (err) {
    throw new Error(err instanceof Error ? err.message : String(err));
  }
};