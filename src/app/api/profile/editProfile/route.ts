import { NextResponse, type NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { dbConnect } from "@/lib/dbconnect";
import { User } from "@/lib/models";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { contact, name } = await req.json();

    await dbConnect();

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    user.name = name;
    user.contact = contact;

    await user.save();

    return NextResponse.json({ message: "Profile updated successfully" });
  } catch {
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 401 }
    );
  }
}
