import type { Metadata } from "next";
import localFont from "next/font/local";
import Script from "next/script";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { BadMo } from "@/components/BadMo";
import { BadMoClickEffect } from "@/components/BadMoClickEffect";
import { siteConfig } from "@/lib/site";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/geist-sans-latin.woff2",
  display: "swap",
  weight: "100 900",
  variable: "--font-geist-sans",
});

const geistMono = localFont({
  src: "./fonts/geist-mono-latin.woff2",
  display: "swap",
  weight: "100 900",
  variable: "--font-geist-mono",
});

const notoSansSC = localFont({
  src: "./fonts/noto-sans-sc-subset.woff2",
  display: "swap",
  weight: "100 900",
  preload: false,
  variable: "--font-noto-sans-sc",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: { default: siteConfig.title, template: `%s | ${siteConfig.name}` },
  description: siteConfig.description,
  alternates: { canonical: "/" },
  openGraph: { title: siteConfig.title, description: siteConfig.description, url: "/", siteName: siteConfig.name, type: "website" },
  twitter: { card: "summary_large_image", title: siteConfig.title, description: siteConfig.description },
  icons: { icon: `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/favicon.svg` },
};

const themeScript = `try{const t=localStorage.getItem('theme');document.documentElement.dataset.theme=t||(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light')}catch(e){}`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

  return (
    <html
      lang="zh-CN"
      className={`${geistSans.variable} ${geistMono.variable} ${notoSansSC.variable}`}
      suppressHydrationWarning
      data-scroll-behavior="smooth"
    >
      <head>
        <Script id="theme-init" strategy="beforeInteractive" dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <a className="skip-link" href="#main-content">
          跳至主要内容
        </a>
        <Navbar musicSrc={`${basePath}/music/badmo-theme.mp3`} />
        <main id="main-content">{children}</main>
        <Footer />
        <BadMo
          spriteSrc={`${basePath}/images/badmo/spritesheet.webp`}
        />
        <BadMoClickEffect />
      </body>
    </html>
  );
}
