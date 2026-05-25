type DashboardLayoutProps = {
  children: React.ReactNode;
};

async function loadDashboardBootstrap() {
  return null;
}

export default async function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  await loadDashboardBootstrap();
  return <>{children}</>;
}
