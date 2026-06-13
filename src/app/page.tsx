import { redirect } from "next/navigation";
import { getAuthSession } from "@/src/lib/auth-session";
import LandingPage from "./(public)/landing/page";

export default async function RootPage() {
  const session = await getAuthSession();

  if (session) {
    if (session.isAdmin) redirect("/admin/dashboard");
    else redirect("/dashboard");
  }

  return <LandingPage />;
}
