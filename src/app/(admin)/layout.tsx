import { AdminShell } from "@/src/components/admin/admin-shell";

type AdminRootLayoutProps = {
  children: React.ReactNode;
};

export default function AdminRootLayout({ children }: AdminRootLayoutProps) {
  return <AdminShell>{children}</AdminShell>;
}
