import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "QR-учет посещаемости",
  description: "Учет посещаемости студентов по QR-коду.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className="h-full">
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
