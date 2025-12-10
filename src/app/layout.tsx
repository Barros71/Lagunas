import "./globals.css";
import Providers from "./providers";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "BG LAGUNAS",
  description: "Painel administrativo para gerenciar tatuagens, drinks e comandas",
  generator: "Next.js",
  applicationName: "BG LAGUNAS",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className="dark">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#0a0a0a" />
      </head>
      <body className="bg-[#0a0a0a] text-white antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
