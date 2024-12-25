import {
  JetBrains_Mono as FontMono,
  Inter as FontSans,
  Space_Grotesk as FontGrotesk,
} from "next/font/google";

export const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const fontMono = FontMono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const fontGrotesk = FontGrotesk({
  subsets: ["latin"],
  variable: "--font-grotesk",
});
