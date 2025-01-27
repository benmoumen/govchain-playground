import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Explore the Digital Wallet",
    short_name: "Digital Wallet Playground",
    description:
      "An interactive platform showcasing real-world use cases of digital wallets, Verifiable Credentials, and blockchain technology.",
    start_url: "/",
    display: "standalone",
    background_color: "#1a1a1a",
    theme_color: "#338fff",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
      {
        src: "/web-app-manifest-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/web-app-manifest-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
