import type { Metadata } from "next";
import { Instrument_Serif, DM_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const display = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

const body = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Voiceprint — by Lightfern",
  description:
    "Paste anything you've written and see your voice mapped back to you: your rhythm, your signature moves, your archetype. Then keep it in every email with Lightfern.",
  openGraph: {
    title: "What does your writing voice sound like?",
    description:
      "Paste anything you've written and get your voiceprint — your rhythm, signature moves, and voice archetype. By Lightfern.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${display.variable} ${body.variable} ${mono.variable} font-sans bg-ink text-bone antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
