import type { Metadata } from "next";
import ClientProviders from "./ClientProviders";
import "../App.css";

export const metadata: Metadata = {
  title: "MKing - Tienda Oficial",
  description: "Equipamiento, chalecos balísticos y tácticos de la más alta calidad y seguridad.",
  icons: {
    icon: "/images/icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
