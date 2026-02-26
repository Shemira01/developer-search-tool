// components/SavedCandidatesUI.tsx
'use client'

import { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Download } from 'lucide-react';

type SavedCandidate = {
  id: string;
  github_username: string;
  name: string | null;
  avatar_url: string | null;
  location: string | null;
  top_languages: string[];
  github_url: string;
  email: string | null;
  notes: string | null;
};

export function SavedCandidatesUI() {
  const [candidates, setCandidates] = useState<SavedCandidate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCandidates();
  }, []);

  async function fetchCandidates() {
    try {
      const res = await fetch('/api/candidates');
      const json = await res.json();
      if (json.data) {
        setCandidates(json.data);
      }
    } catch (error) {
      console.error("Failed to fetch pipeline", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdateNote(id: string, notes: string) {
    try {
      await fetch('/api/candidates', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, notes })
      });
      // Optionally show a "Saved!" toast here if you add a toast library later
    } catch (error) {
      console.error("Failed to save note", error);
    }
  }

  function handleExportCSV() {
    if (candidates.length === 0) return;

    // 1. Define CSV headers
    const headers = ['Name', 'GitHub Username', 'Location', 'Top Languages', 'Email', 'GitHub URL', 'Notes'];
    
    // 2. Map data to rows
    const rows = candidates.map(c => [
      `"${c.name || ''}"`,
      `"${c.github_username || ''}"`,
      `"${c.location || ''}"`,
      `"${c.top_languages.join(', ') || ''}"`,
      `"${c.email || ''}"`,
      `"${c.github_url || ''}"`,
      `"${(c.notes || '').replace(/"/g, '""')}"` // Escape quotes in notes
    ]);

    // 3. Combine and create blob
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    // 4. Trigger download
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'developer_pipeline.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  if (loading) return <div className="text-muted-foreground">Loading pipeline...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Your Pipeline ({candidates.length})</h2>
        <Button onClick={handleExportCSV} variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </Button>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Developer</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Languages</TableHead>
              <TableHead>Notes / Tags</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {candidates.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground h-24">
                  No candidates saved yet.
                </TableCell>
              </TableRow>
            ) : (
              candidates.map((candidate) => (
                <TableRow key={candidate.id}>
                  <TableCell className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={candidate.avatar_url || ''} />
                      <AvatarFallback>{candidate.github_username.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{candidate.name || candidate.github_username}</div>
                      <a href={candidate.github_url} target="_blank" rel="noreferrer" className="text-xs text-blue-500 hover:underline">
                        View GitHub
                      </a>
                    </div>
                  </TableCell>
                  <TableCell>{candidate.location || '—'}</TableCell>
                  <TableCell className="max-w-[150px] truncate">
                    {candidate.top_languages.join(', ') || '—'}
                  </TableCell>
                  <TableCell>
                    <Textarea 
                      defaultValue={candidate.notes || ''}
                      placeholder="Add notes (e.g., 'Reached out 2/22')"
                      className="min-h-[60px] resize-none text-sm"
                      onBlur={(e) => handleUpdateNote(candidate.id, e.target.value)}
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}