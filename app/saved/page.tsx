// app/saved/page.tsx
import { SavedCandidatesUI } from '../../components/SavedCandidatesUI';

export default function SavedPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Saved Candidates</h1>
        <p className="text-muted-foreground mt-2">
          Review your shortlisted developers, add notes, and export your pipeline.
        </p>
      </div>
      
      <SavedCandidatesUI />
    </div>
  );
}