import { NextResponse, type NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { dbConnect } from "@/lib/dbconnect";
import { getUserById } from "@/lib/actions";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { password, currentPassword } = await req.json();

    await dbConnect();

    const user = await getUserById(session.user.id);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    if (currentPassword !== user.password) {
      return NextResponse.json(
        { message: "Wrong old password" },
        { status: 404 }
      );
    }

    user.password = password;

    await user.save();

    return NextResponse.json({ message: "Profile updated successfully" });
  } catch {
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 401 }
    );
  }
}
