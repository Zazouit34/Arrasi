import type { Metadata } from "next";
import './globals.css'
import { Great_Vibes, Playfair_Display, DM_Sans } from 'next/font/google'
import { cn } from "@/lib/utils"
import { Navbar } from "@/app/components/navbar"
import { AuthProvider } from "@/lib/auth-context"
import { Toaster } from "@/components/ui/sonner"
import { SITE } from "@/lib/config"
import '@/app/lib/preload-data'

const greatVibes = Great_Vibes({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-great-vibes',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
})

export const metadata: Metadata = {
    title: SITE.title,
    description: SITE.desc,
    keywords: SITE.keywords,
    icons: {
        icon: [
            { url: "/favicon.ico", sizes: "any" },
            { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
            { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" }
        ],
        shortcut: "/favicon.ico",
        apple: "/apple-touch-icon.png",
        other: {
            rel: "apple-touch-icon",
            url: "/apple-touch-icon.png"
        }
    },
    openGraph: {
        title: SITE.title,
        description: SITE.desc,
        images: [
            {
                url: SITE.ogImage,
                width: 1200,
                height: 630,
                alt: "WedBook - Wedding Venues in Algeria"
            }
        ],
        type: "website",
        locale: "en_US",
        siteName: "WedBook"
    },
    alternates: {
        canonical: SITE.siteUrl
    },
    manifest: "/site.webmanifest",
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    metadataBase: new URL(
        process.env.NODE_ENV === 'production'
            ? SITE.siteUrl
            : 'http://localhost:3000'
    ),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={cn(
        "min-h-screen bg-background font-sans antialiased",
        greatVibes.variable,
        playfair.variable,
        dmSans.variable 
      )} suppressHydrationWarning>
        <AuthProvider>
          <Navbar />
          {children}
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  )
}