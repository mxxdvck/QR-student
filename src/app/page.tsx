import { redirect } from "next/navigation";
import { getCurrentSession } from "@/lib/auth";
import { getRoleHomePath } from "@/lib/session";

export default async function Home() {
  const session = await getCurrentSession();

  redirect(session ? getRoleHomePath(session.role) : "/login");
}
