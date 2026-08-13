"use client";

/**
 * CSS compartilhado entre a tela pública do memorial e o preview de criação.
 *
 * Deliberadamente enxuto: o memorial anterior tinha ~30 divs de partículas
 * animadas por seção, glows pulsantes e cascatas de fade-in escalonadas em
 * até 5 segundos. Mantemos só duas microinterações intencionais — a chama da
 * vela tremeluzindo e o leve tilt de hover nos polaroids da linha do tempo —
 * porque o pedido do dono foi "moderno e simples, nada com cara de IA".
 */
export function MemorialStyles() {
  return (
    <style>{`
      .memorial-glass-panel {
        background: rgba(28, 32, 32, 0.45);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        border: 1px solid rgba(233, 195, 73, 0.08);
      }
      .memorial-timeline-line::before {
        content: '';
        position: absolute;
        top: 0;
        bottom: 0;
        left: 50%;
        width: 1px;
        background: linear-gradient(to bottom, transparent, rgba(233, 195, 73, 0.3), transparent);
        transform: translateX(-50%);
      }
      @keyframes memorial-fade-in {
        from { opacity: 0; transform: translateY(8px); }
        to { opacity: 1; transform: translateY(0); }
      }
      .memorial-fade-in {
        animation: memorial-fade-in 0.4s ease-out both;
      }
      /* Aura atrás do retrato — luz de vela, respirando devagar.
         Substitui a antiga imagem de fundo que vinha de uma URL temporária. */
      @keyframes memorial-breathe {
        0%, 100% { transform: scale(1);    opacity: 0.55; }
        50%      { transform: scale(1.06); opacity: 0.85; }
      }
      .memorial-aura {
        background: radial-gradient(
          circle,
          rgba(233, 195, 73, 0.22) 0%,
          rgba(233, 195, 73, 0.09) 38%,
          transparent 70%
        );
        filter: blur(26px);
        animation: memorial-breathe 7s ease-in-out infinite;
      }
      .memorial-aura-ring {
        animation: memorial-breathe 7s ease-in-out infinite;
        animation-delay: 1.2s;
        opacity: 0.5;
      }
      /* Quem pediu menos movimento no sistema não vê a animação. */
      @media (prefers-reduced-motion: reduce) {
        .memorial-aura,
        .memorial-aura-ring {
          animation: none;
        }
      }
      @keyframes memorial-flicker {
        0%, 100% { transform: scale(1) rotate(-1deg); opacity: 0.95; }
        20% { transform: scale(0.9) rotate(1deg); opacity: 0.8; }
        40% { transform: scale(1.1) rotate(-2deg); opacity: 1; }
        60% { transform: scale(0.95) rotate(0deg); opacity: 0.85; }
        80% { transform: scale(1.05) rotate(2deg); opacity: 0.95; }
      }
      .memorial-flicker {
        animation: memorial-flicker 0.6s infinite alternate ease-in-out;
        transform-origin: bottom center;
      }
      .memorial-polaroid-left {
        transform: rotate(-2deg);
        transition: transform 0.3s ease, box-shadow 0.3s ease;
      }
      .memorial-polaroid-left:hover,
      .memorial-polaroid-left:focus-visible {
        transform: rotate(0deg) scale(1.03) translateY(-4px);
        box-shadow: 0 16px 32px rgba(0, 0, 0, 0.5);
      }
      .memorial-polaroid-right {
        transform: rotate(2deg);
        transition: transform 0.3s ease, box-shadow 0.3s ease;
      }
      .memorial-polaroid-right:hover,
      .memorial-polaroid-right:focus-visible {
        transform: rotate(0deg) scale(1.03) translateY(-4px);
        box-shadow: 0 16px 32px rgba(0, 0, 0, 0.5);
      }
      @media (prefers-reduced-motion: reduce) {
        .memorial-flicker,
        .memorial-fade-in {
          animation: none !important;
        }
      }
    `}</style>
  );
}
