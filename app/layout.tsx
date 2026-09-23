import type { Metadata } from "next";
import "./globals.css";
import "./user-theme.css";

export const metadata: Metadata = {
  title: "SETHO — juntos por um futuro melhor",
  description: "Encontre ONGs, faça doações e participe de voluntariados.",
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/setho.jpeg",
    shortcut: "/setho.jpeg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">{children}</body>
    </html>
  );
}


