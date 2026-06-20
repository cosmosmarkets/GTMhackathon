import type { Metadata } from "next";
import { Cormorant_Garamond, EB_Garamond, Marcellus_SC } from "next/font/google";
import "./globals.css";

// Display serif — the Voiceprint wordmark and oversized headlines.
const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

// Body serif — the running prose of the reading room.
const body = EB_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-body",
  display: "swap",
});

// Small-caps label face — the engraved Marcellus labels and buttons.
const label = Marcellus_SC({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-label",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Voiceprint — A Lightfern Reading Room",
  description:
    "Paste anything you've written and we read your real voice back, drawn true — your rhythm, your signature moves, your archetype. Then Lightfern keeps that voice in every email.",
  openGraph: {
    title: "What's your writing voice?",
    description:
      "A reading of your voice. Paste what you've written and get your voiceprint — rhythm, signature moves, and archetype. A Lightfern reading room.",
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
        className={`${display.variable} ${body.variable} ${label.variable} font-body bg-paper text-ink antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
