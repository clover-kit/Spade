import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google"; // Changed fonts
import Script from "next/script"; // Import Script
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Spade - Code Snippet Generator",
  description: "Create beautiful code snippets with Spade",
  icons: {
    icon: "/favlogo.png",
    shortcut: "/favlogo.png",
    apple: "/favlogo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased bg-[#050505] text-[#d4d4d8]`}
      >
        {children}
        <Script src="https://code.iconify.design/3/3.1.0/iconify.min.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
