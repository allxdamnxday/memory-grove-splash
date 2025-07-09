import type { Metadata } from "next";
import "./globals.css";
import AuthHeader from "@/components/layout/AuthHeader";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://memorygrove.com'),
  title: "Memory Groves - Where Memories Bloom Eternal",
  description: "Create a sacred digital sanctuary where memories bloom eternal. Preserve your essence, share your wisdom, and ensure your love lives on through voice, story, and connection.",
  keywords: "digital legacy planning, preserve family memories, voice recording for memories, ethical AI memorial",
  authors: [{ name: "Memory Groves" }],
  openGraph: {
    title: "Memory Groves - Where Memories Bloom Eternal",
    description: "Create a sacred digital sanctuary where memories bloom eternal.",
    url: "https://memorygrove.com",
    siteName: "Memory Groves",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Memory Groves - A peaceful garden where memories bloom",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Memory Groves - Where Memories Bloom Eternal",
    description: "Create a sacred digital sanctuary where memories bloom eternal.",
    images: ["/images/twitter-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/images/favicon.ico",
    shortcut: "/images/favicon-16x16.png",
    apple: "/images/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-warm-white text-text-primary antialiased flex flex-col">
        <AuthHeader />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
