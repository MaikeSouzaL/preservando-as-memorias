"use client";

/**
 * UserAvatar — exibe a foto real do usuário ou um círculo com iniciais.
 * Nunca usa foto de estranho como fallback.
 */

type Props = {
  avatarUrl?: string | null;
  name?: string | null;
  size?: number; // em px — padrão 40
  className?: string;
};

/** Gera as iniciais a partir do nome (até 2 caracteres) */
function getInitials(name?: string | null): string {
  if (!name?.trim()) return "?";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

/**
 * Gera uma cor de fundo consistente a partir do nome.
 * Sempre retorna um tom escuro + o padrão ouro da plataforma.
 */
function getBgColor(name?: string | null): string {
  const colors = [
    "bg-[#1a2f2a] text-[#e9c349]",
    "bg-[#1a1f2e] text-[#a78bfa]",
    "bg-[#2e1a1a] text-[#f87171]",
    "bg-[#1a2e20] text-[#34d399]",
    "bg-[#2e2a1a] text-[#fbbf24]",
    "bg-[#1a2a2e] text-[#38bdf8]",
  ];
  if (!name?.trim()) return "bg-[#1a2f2a] text-[#e9c349]";
  const code = name.trim().charCodeAt(0) + (name.trim().charCodeAt(1) || 0);
  return colors[code % colors.length];
}

export function UserAvatar({ avatarUrl, name, size = 40, className = "" }: Props) {
  const initials = getInitials(name);
  const colorClass = getBgColor(name);
  const fontSize = Math.max(10, Math.floor(size * 0.36));

  if (avatarUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={avatarUrl}
        alt={name || "Avatar"}
        width={size}
        height={size}
        className={`rounded-full object-cover ${className}`}
        style={{ width: size, height: size }}
        onError={(e) => {
          // Se a URL quebrar, esconde a imagem e deixa o CSS background aparecer
          (e.target as HTMLImageElement).style.display = "none";
        }}
      />
    );
  }

  return (
    <div
      className={`flex shrink-0 select-none items-center justify-center rounded-full font-bold uppercase ${colorClass} ${className}`}
      style={{ width: size, height: size, fontSize }}
      aria-label={name || "Avatar"}
    >
      {initials}
    </div>
  );
}
