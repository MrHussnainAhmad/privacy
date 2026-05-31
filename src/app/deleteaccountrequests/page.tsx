import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import DeleteAccountRequestsAdmin from "@/components/deletion/DeleteAccountRequestsAdmin";

export default async function DeleteAccountRequestsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/auth/login");

  return <DeleteAccountRequestsAdmin />;
}
