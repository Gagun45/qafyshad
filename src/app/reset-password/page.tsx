import { ResetForm } from "@/components/ResetForm";
import { Button } from "@/components/ui/button";
import { dbConnect } from "@/lib/dbconnect";
import { User } from "@/lib/models";
import Link from "next/link";

interface Props {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ResetPage({ searchParams }: Props) {
  const token = (await searchParams)?.token;

  const invalidToken = (message: string) => {
    return (
      <main className="flex flex-col gap-4 text-4xl">
        <span>{message}</span>
        <Button asChild className="w-fit" size={"lg"}>
          <Link href="/">Homepage</Link>
        </Button>
      </main>
    );
  };

  if (!token || token.length != 64) {
    return invalidToken("Invalid token");
  }
  await dbConnect();
  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordTokenExpiry: { $gt: Date.now() },
  });

  if (!user) {
    return invalidToken("Invalid or expired token");
  }
  return (
    <main>
      <header>
        <h1 className="pageHeading">Reset Password</h1>
      </header>
      <ResetForm token={token as string} />
    </main>
  );
}
