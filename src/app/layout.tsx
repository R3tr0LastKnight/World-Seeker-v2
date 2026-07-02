import type { Metadata } from "next";
import { Google_Sans } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import { Toaster } from "@/components/ui/sonner";
import ThemeInitializer from "@/components/ThemeInitializer";

const googleSans = Google_Sans({
  variable: "--font-google-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "World Seeker",
  description: "Chart the world.",
  icons: {
    icon: [
      {
        media: "(prefers-color-scheme: dark)",
        url: "/world-dark.png",
        href: "/world-dark.png",
      },
      {
        media: "(prefers-color-scheme: light)",
        url: "/world-light.png",
        href: "/world-light.png",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${googleSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <Nav unknown={undefined} />
        <ThemeInitializer />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
