import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Preservando a Memoria",
    short_name: "Memoria",
    description:
      "Memorial digital com QR Code para visitantes conhecerem historias de entes queridos.",
    start_url: "/",
    display: "standalone",
    background_color: "#0b0f0f",
    theme_color: "#101414",
    icons: [
      {
        src: "/images/logo.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/images/logo.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
