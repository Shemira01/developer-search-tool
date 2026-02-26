// app/layout.tsx
import './globals.css';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Users, Code, Bookmark } from 'lucide-react';

export const metadata: Metadata = {
  title: 'DevHunter',
  description: 'Developer Search & Pipeline Tool',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // suppressHydrationWarning prevents the browser extension crashes
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning className="flex min-h-screen bg-zinc-50 dark:bg-zinc-950">
        
        {/* Sidebar Navigation */}
        <aside className="w-64 bg-white dark:bg-zinc-900 border-r flex flex-col">
          <div className="h-16 flex items-center px-6 border-b font-bold text-xl tracking-tight">
            DevHunter
          </div>
          <nav className="flex-1 p-4 space-y-2">
            <Link href="/" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 text-sm font-medium transition-colors">
              <Users className="w-4 h-4" />
              Developer Search
            </Link>
            <Link href="/repos" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 text-sm font-medium transition-colors">
              <Code className="w-4 h-4" />
              Repo Discovery
            </Link>
            <Link href="/saved" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 text-sm font-medium transition-colors">
              <Bookmark className="w-4 h-4" />
              Saved Candidates
            </Link>
          </nav>
        </aside>

        {/* Main Workspace */}
        <main className="flex-1 overflow-auto">
          <div className="p-8">
            {children}
          </div>
        </main>

      </body>
    </html>
  );
}