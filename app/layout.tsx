import type { Metadata } from "next";
import "./globals.css";
import { getBrand } from "@/lib/branding";

export async function generateMetadata(): Promise<Metadata> {
  const brand = await getBrand()
  return {
    title: brand.name === 'mitNORM' ? 'MYVI Dialoge' : 'Value Factory',
    description: `Berater-Dashboard für ${brand.name} Firmenkontakte`,
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" className="h-full">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
