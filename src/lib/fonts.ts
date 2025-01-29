import {
  Space_Grotesk as FontGrotesk,
  JetBrains_Mono as FontMono,
  Inter as FontSans,
} from "next/font/google";

export const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  adjustFontFallback: false,
});

export const fontMono = FontMono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  adjustFontFallback: false,
});

export const fontGrotesk = FontGrotesk({
  subsets: ["latin"],
  variable: "--font-grotesk",
  display: "swap",
  adjustFontFallback: false,
});
