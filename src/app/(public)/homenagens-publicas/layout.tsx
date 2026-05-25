type ScreenLayoutProps = {
  children: React.ReactNode;
};

async function loadScreenData() {
  return null;
}

export default async function ScreenLayout({ children }: ScreenLayoutProps) {
  await loadScreenData();
  return <>{children}</>;
}
