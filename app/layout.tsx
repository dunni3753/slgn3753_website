import type { Metadata, Viewport } from "next";
import { Space_Grotesk, IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";

import "./globals.css";
import { CartProvider } from "@/components/cart-provider";
import { AppSessionProvider } from "@/components/session-provider";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const plexSans = IBM_Plex_Sans({
  variable: "--font-plex-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Sniper Lens Global Networks",
    template: "%s | Sniper Lens Global Networks",
  },
  description:
    "Sniper Lens Global Networks sells and installs CCTV cameras, intercoms, electric fencing, fire alarm systems and home automation devices, with nationwide installation and support.",
  keywords: [
    "CCTV cameras",
    "PTZ camera",
    "dome camera",
    "bullet camera",
    "intercom systems",
    "electric fence",
    "fire alarm systems",
    "home automation",
    "security gadgets",
    "Sniper Lens Global Networks",
  ],
  authors: [{ name: "Sniper Lens Global Networks" }],
  openGraph: {
    type: "website",
    title: "Sniper Lens Global Networks",
    description:
      "CCTV cameras, intercoms, electric fencing, fire alarm systems and home automation, sold, installed and supported nationwide.",
    url: siteUrl,
    siteName: "Sniper Lens Global Networks",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Sniper Lens Global Networks",
      },
    ],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sniper Lens Global Networks",
    description:
      "CCTV cameras, intercoms, electric fencing, fire alarm systems and home automation, sold, installed and supported nationwide.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f3f4f1" },
    { media: "(prefers-color-scheme: dark)", color: "#10141a" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${plexSans.variable} ${plexMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground font-body">
        <AppSessionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <CartProvider>
              <div className="flex-1">{children}</div>
            </CartProvider>
          </ThemeProvider>
        </AppSessionProvider>
      </body>
    </html>
  );
}
