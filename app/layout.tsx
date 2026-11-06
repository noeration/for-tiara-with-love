import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Great_Vibes, Plus_Jakarta_Sans } from "next/font/google";
import { birthday } from "@/data/birthday";
import "./globals.css";

const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const sans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

const script = Great_Vibes({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-great-vibes",
  display: "swap",
});

const siteUrl =
  birthday.site.url.trim() ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: birthday.site.title,
  description: birthday.site.description,
  applicationName: birthday.site.title,
  openGraph: {
    title: birthday.site.title,
    description: birthday.site.description,
    type: "website",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: birthday.site.title }],
  },
  twitter: {
    card: "summary_large_image",
    title: birthday.site.title,
    description: birthday.site.description,
    images: ["/og.png"],
  },
  // Hadiah personal: jangan tampil di mesin pencari, tapi tetap bisa dibuka lewat link.
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#140a22",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id" className={`${serif.variable} ${sans.variable} ${script.variable}`}>
      <body className="min-h-dvh bg-background text-foreground antialiased">
        <a
          href="#konten"
          className="sr-only z-[200] rounded-full bg-lavender px-5 py-3 font-sans text-sm font-semibold text-plum focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          Lompat ke konten
        </a>
        {children}
      </body>
    </html>
  );
}
