// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DevHunter | Developer Search Tool",
  description: "Find, rank, and save top developers",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} flex min-h-screen`}>
        <Sidebar />
        <main className="flex-1 overflow-y-auto bg-white dark:bg-zinc-950 p-8">
          {children}
        </main>
      </body>
    </html>
  );
}