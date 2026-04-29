import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pancake — Commerce for AI Agents",
  description:
    "Payments infrastructure for agent-native commerce. One-time, subscription, and result-based billing, all built for agents to operate.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body>{children}</body>
    </html>
  );
}
