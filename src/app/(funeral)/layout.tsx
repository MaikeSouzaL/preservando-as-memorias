/**
 * Passthrough intencional.
 *
 * `/funeraria/login` e `/funeraria/cadastro` precisam ser públicas, então o
 * guard não pode viver aqui — ele está em `src/middleware.ts`, que conhece o
 * pathname, mais as checagens de sessão dentro de cada página protegida.
 */
export default function FuneralLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
