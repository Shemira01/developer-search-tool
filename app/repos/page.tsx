// app/repos/page.tsx
import { RepoSearchUI } from '../../components/RepoSearchUI';

export default function ReposPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Repository Discovery</h1>
        <p className="text-muted-foreground mt-2">
          Use natural language to find interesting codebases and discover the developers behind them.
        </p>
      </div>
      
      <RepoSearchUI />
    </div>
  );
}