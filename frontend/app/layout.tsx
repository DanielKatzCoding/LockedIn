import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LockedIn",
  description: "Full stack Next.js + Python app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
