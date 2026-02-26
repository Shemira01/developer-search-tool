// app/page.tsx
import { SearchUI } from '@/components/SearchUI';

export default function Home() {
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Developer Search</h1>
        <p className="text-muted-foreground mt-2">
          Search for developers by name, bio, skills, company, or location.
        </p>
      </div>
      
      {/* Our client component containing the search input, logic, and results UI */}
      <SearchUI />
    </div>
  );
}