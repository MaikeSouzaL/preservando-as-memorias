type LoginLayoutProps = {
  children: React.ReactNode;
};

async function loadLoginBootstrap() {
  return null;
}

export default async function LoginLayout({ children }: LoginLayoutProps) {
  await loadLoginBootstrap();
  return <>{children}</>;
}
