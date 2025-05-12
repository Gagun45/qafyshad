import { ResetForm } from "@/components/ResetForm";
import { dbConnect } from "@/lib/dbconnect";
import { User } from "@/lib/models";

interface Props {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ResetPage({ searchParams }: Props) {
  const token = (await searchParams)?.token;
  await dbConnect();
  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordTokenExpiry: { $gt: new Date() },
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
