// components/Sidebar.tsx
import Link from 'next/link';
import { Search, GitBranch, Users } from 'lucide-react';
import { Button } from '@/components/ui/button'; // Assuming shadcn put ui components here

export function Sidebar() {
  return (
    <div className="w-64 border-r bg-zinc-50/50 dark:bg-zinc-900/50 hidden md:flex flex-col h-screen p-4">
      <div className="mb-8 px-4">
        <h1 className="text-xl font-bold tracking-tight">DevHunter</h1>
      </div>
      
      <nav className="space-y-2 flex-1">
        <Link href="/">
          <Button variant="ghost" className="w-full justify-start">
            <Search className="mr-2 h-4 w-4" />
            Developer Search
          </Button>
        </Link>
        <Link href="/repos">
          <Button variant="ghost" className="w-full justify-start">
            <GitBranch className="mr-2 h-4 w-4" />
            Repo Discovery
          </Button>
        </Link>
        <Link href="/saved">
          <Button variant="ghost" className="w-full justify-start">
            <Users className="mr-2 h-4 w-4" />
            Saved Candidates
          </Button>
        </Link>
      </nav>
      
      <div className="mt-auto px-4 text-xs text-muted-foreground">
        Powered by Bountylab
      </div>
    </div>
  );
}