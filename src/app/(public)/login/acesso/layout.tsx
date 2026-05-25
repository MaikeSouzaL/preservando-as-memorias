type AcessoLayoutProps = {
  children: React.ReactNode;
};

async function loadAcessoBootstrap() {
  return null;
}

export default async function AcessoLayout({ children }: AcessoLayoutProps) {
  await loadAcessoBootstrap();
  return <>{children}</>;
}
