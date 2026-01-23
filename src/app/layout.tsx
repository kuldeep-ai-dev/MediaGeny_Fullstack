import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { getPageSeo } from "@/actions/seo-actions";
import { JsonLd } from "@/components/seo/JsonLd";

const inter = Inter({ subsets: ["latin"] });

export async function generateMetadata(): Promise<Metadata> {
  const { data } = await getPageSeo("home")

  return {
    title: data?.title || "MediaGeny | Digital Agency",
    description: data?.description || "Empowering Your Digital Future with Premium Web & Software Solutions.",
    keywords: data?.keywords?.split(",") || ["Digital Agency", "Web Development", "Software Solutions"],
    openGraph: {
      title: data?.title || "MediaGeny | Digital Agency",
      description: data?.description || "Empowering Your Digital Future with Premium Web & Software Solutions.",
    },
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { data } = await getPageSeo("home")

  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} min-h-screen bg-background antialiased selection:bg-primary/20`}>
        <JsonLd data={data?.schema_markup} />
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
