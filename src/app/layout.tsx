import type { Metadata } from "next";
import { Google_Sans } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";

const googleSans = Google_Sans({
  variable: "--font-google-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "World Seeker",
  description: "Chart the world.",
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
        {children}
      </body>
    </html>
  );
}
