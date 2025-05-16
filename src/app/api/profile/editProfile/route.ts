import { NextResponse, type NextRequest } from "next/server";
import { dbConnect } from "@/lib/dbconnect";
import { getServerSession, getUserById } from "@/lib/helper";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { contact, name } = await req.json();

    await dbConnect();

    const user = await getUserById(session.user.id);
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
