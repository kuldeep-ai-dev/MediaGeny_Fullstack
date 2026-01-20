import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MediaGeny | Digital Agency",
  description: "Empowering Your Digital Future with Premium Web & Software Solutions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" class="dark">
      <body className={`${inter.className} min-h-screen bg-background antialiased selection:bg-primary/20`}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
