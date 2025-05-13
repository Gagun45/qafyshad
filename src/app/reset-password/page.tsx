import { ResetForm } from "@/components/ResetForm";
import { dbConnect } from "@/lib/dbconnect";
import { User } from "@/lib/models";

interface Props {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ResetPage({ searchParams }: Props) {
  const token = (await searchParams)?.token;

  if (!token) {
    return <div>No token provided</div>;
  }
  if (token.length != 64) {
    return <div>Wrong token</div>;
  }
  await dbConnect();
  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordTokenExpiry: { $gt: Date.now() },
  });

  if (!user) {
    return <div>Invalid token</div>;
  }
  return (
    <div>
      Reset Form
      <ResetForm token={token as string} />
    </div>
  );
}
