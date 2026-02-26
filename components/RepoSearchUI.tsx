// components/RepoSearchUI.tsx
'use client'

import { useState } from 'react';
import { searchRepositories } from '../app/actions/repos';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Card, CardDescription } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { Label } from './ui/label';
import { Search, Star, GitFork, Users } from 'lucide-react';

type Contributor = {
  username?: string;
  login?: string;
  avatarUrl?: string;
  avatar_url?: string;
};

type Repo = {
  id?: string | number;
  name?: string;
  full_name?: string;
  description?: string;
  language?: string;
  stars?: number;
  stargazers_count?: number;
  forks?: number;
  forks_count?: number;
  url?: string;
  html_url?: string;
  contributors?: Contributor[];
  owners?: Contributor[];
};

export function RepoSearchUI() {
  const [query, setQuery] = useState('');
  const [language, setLanguage] = useState('');
  const [minStars, setMinStars] = useState<number | ''>('');
  
  const [results, setResults] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);

    const res = await searchRepositories({ 
      query, 
      language, 
      minStars: minStars === '' ? 0 : Number(minStars) 
    });

    if (res.error) {
      setError(res.error.message);
    } else if (res.data) {
      const dataObj = res.data as { items?: Repo[] } | Repo[];
      setResults(Array.isArray(dataObj) ? dataObj : dataObj.items || []);
    }
    
    setLoading(false);
  }

  return (
    <div className="space-y-8">
      <Card className="p-4">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="flex gap-2">
            <div className="flex-1">
              <Label htmlFor="query" className="sr-only">Semantic Search</Label>
              <Input 
                id="query"
                placeholder='e.g., "payment processing microservice in Go" or "React state management"' 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full"
              />
            </div>
            <Button type="submit" disabled={loading} className="w-32">
              {loading ? 'Searching...' : <Search className="w-4 h-4 mr-2" />}
              Search
            </Button>
          </div>
          
          <div className="flex gap-4">
            <div className="w-1/3">
              <Label htmlFor="language" className="text-xs text-muted-foreground mb-1 block">Language Filter</Label>
              <Input 
                id="language"
                placeholder="e.g., TypeScript, Python" 
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="h-8 text-sm"
              />
            </div>
            <div className="w-1/3">
              <Label htmlFor="stars" className="text-xs text-muted-foreground mb-1 block">Min Stars</Label>
              <Input 
                id="stars"
                type="number"
                placeholder="0" 
                value={minStars}
                onChange={(e) => setMinStars(e.target.value ? Number(e.target.value) : '')}
                className="h-8 text-sm"
              />
            </div>
          </div>
        </form>
      </Card>

      {error && <div className="text-red-500 font-medium">{error}</div>}

      <div className="grid grid-cols-1 gap-4">
        {results.length === 0 && !loading && !error && (
          <div className="text-center py-12 border-2 border-dashed rounded-lg text-muted-foreground">
            No repositories found. Try a different semantic query!
          </div>
        )}

        {results.map((repo, i) => (
          <Card key={repo.id || i} className="overflow-hidden">
            <div className="p-6 flex flex-col md:flex-row gap-6">
              <div className="flex-1 space-y-3">
                <div>
                  <a href={repo.url || repo.html_url} target="_blank" rel="noreferrer" className="text-xl font-bold text-blue-600 hover:underline inline-flex items-center gap-2">
                    {repo.name || repo.full_name}
                  </a>
                  <CardDescription className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2">
                    {repo.description || 'No description provided.'}
                  </CardDescription>
                </div>
                
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  {repo.language && (
                    <Badge variant="outline" className="bg-zinc-100 dark:bg-zinc-800">{repo.language}</Badge>
                  )}
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4" /> {(repo.stars || repo.stargazers_count || 0).toLocaleString()}
                  </div>
                  <div className="flex items-center gap-1">
                    <GitFork className="w-4 h-4" /> {(repo.forks || repo.forks_count || 0).toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="md:w-72 bg-zinc-50 dark:bg-zinc-900 rounded-lg p-4 border">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Users className="w-4 h-4" /> Top Contributors
                </h4>
                <div className="space-y-3">
                  {(repo.contributors || repo.owners || []).slice(0, 3).map((user, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <div className="flex items-center gap-2 overflow-hidden">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.avatarUrl || user.avatar_url} />
                          <AvatarFallback>{(user.username || user.login || 'U').charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium truncate">{user.username || user.login || 'Unknown'}</span>
                      </div>
                      <Button variant="ghost" size="sm" className="h-7 text-xs px-2">
                        View
                      </Button>
                    </div>
                  ))}
                  {(!repo.contributors && !repo.owners) && (
                    <div className="text-xs text-muted-foreground italic">No contributor data available.</div>
                  )}
                </div>
              </div>

            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}