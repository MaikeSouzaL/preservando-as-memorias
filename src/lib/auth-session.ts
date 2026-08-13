import { createAdminClient, createClientServer } from "@/src/lib/supabase";

export type AuthSession = {
  email: string;
  /**
   * Sinônimo de `isDevAdmin`.
   *
   * O papel de "representante/operador" foi extinto: só existe um administrador,
   * o dono da plataforma. O campo continua aqui porque ~14 pontos do app o usam
   * para decidir escopo de dados ("vê tudo") e isenção de pagamento — ambos
   * corretos para o dono.
   */
  isAdmin: boolean;
  isDevAdmin: boolean;
  userId: string;
};

export async function getAuthSession(): Promise<AuthSession | null> {
  try {
    const supabase = await createClientServer();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user || !user.email) return null;

    // Lido com a service role de propósito: com o client de usuário, uma
    // policy de SELECT ausente em `profiles` devolve null sem erro e o dono
    // silenciosamente vira usuário comum, perdendo o painel inteiro.
    const admin = await createAdminClient();
    const { data: profile, error: profileError } = await admin
      .from("profiles")
      .select("is_dev_admin")
      .eq("id", user.id)
      .maybeSingle();

    if (profileError) {
      console.error("Falha ao carregar o perfil da sessão:", profileError);
    }

    const isOwner = profile?.is_dev_admin ?? false;

    return {
      email: user.email.toLowerCase().trim(),
      isAdmin: isOwner,
      isDevAdmin: isOwner,
      userId: user.id,
    };
  } catch (err) {
    console.error("Falha ao resolver a sessão:", err);
    return null;
  }
}
