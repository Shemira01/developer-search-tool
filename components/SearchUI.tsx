// components/SearchUI.tsx
'use client'

import { useState, useMemo, useCallback } from 'react';
import { searchDevelopers } from '../app/actions/bounty';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { Slider } from './ui/slider';
import { Label } from './ui/label';
import { Search, SlidersHorizontal } from 'lucide-react';

export type Developer = {
  id?: string | number;
  username?: string;
  login?: string;
  name?: string;
  location?: string;
  bio?: string;
  avatarUrl?: string;
  avatar_url?: string;
  languages?: string[];
  url?: string;
  html_url?: string;
  email?: string;
  company?: string;
  devRank?: number;
  stars?: number;
  activityScore?: number;
  contributions?: number;
  followers?: number;
};

export function SearchUI() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Developer[]>([]); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [savingIds, setSavingIds] = useState<Set<string>>(new Set());
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());

  const [weights, setWeights] = useState({
    devRank: 40,
    stars: 30,
    activity: 20,
    followers: 10,
  });

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);

    const res = await searchDevelopers({ query, page: 1 });

    if (res.error) {
      setError(res.error.message);
    } else if (res.data) {
      const dataObj = res.data as { items?: Developer[] } | Developer[];
      setResults(Array.isArray(dataObj) ? dataObj : dataObj.items || []);
    }
    
    setLoading(false);
  }

  const calculateScore = useCallback((dev: Developer) => {
    const devRank = dev.devRank || 0; 
    const stars = dev.stars || 0; 
    const activity = dev.activityScore || dev.contributions || 0;
    const followers = dev.followers || 0;

    const normalizedStars = Math.min(stars, 5000) / 50; 
    const normalizedFollowers = Math.min(followers, 1000) / 10; 

    const score = 
      (devRank * (weights.devRank / 100)) +
      (normalizedStars * (weights.stars / 100)) +
      (activity * (weights.activity / 100)) +
      (normalizedFollowers * (weights.followers / 100));

    return Math.round(score);
  }, [weights]);

  const rankedResults = useMemo(() => {
    return [...results].sort((a, b) => calculateScore(b) - calculateScore(a));
  }, [results, calculateScore]);

  async function handleSaveCandidate(dev: Developer) {
    const devId = String(dev.username || dev.id || dev.name);
    if (!devId) return;

    setSavingIds(prev => new Set(prev).add(devId));

    try {
      const payload = {
        github_username: dev.username || dev.login || 'unknown_user',
        name: dev.name || null,
        avatar_url: dev.avatarUrl || dev.avatar_url || null,
        location: dev.location || null,
        company: dev.company || null,
        top_languages: dev.languages ? dev.languages.slice(0, 5) : [],
        github_url: dev.url || dev.html_url || `https://github.com/${dev.username || 'unknown'}`,
        email: dev.email || null,
        notes: "", 
      };

      const response = await fetch('/api/candidates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (!response.ok) {
        if (result.error?.code === 'CONFLICT') {
          setSavedIds(prev => new Set(prev).add(devId));
        } else {
          console.error("Validation or Server Error:", result.error);
          alert(`Failed to save: ${result.error?.message || 'Unknown error'}`);
        }
      } else {
        setSavedIds(prev => new Set(prev).add(devId));
      }
    } catch (err) {
      console.error("Fetch error:", err);
      alert("A network error occurred while saving.");
    } finally {
      setSavingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(devId);
        return newSet;
      });
    }
  }

  return (
    <div className="space-y-8">
      <form onSubmit={handleSearch} className="flex gap-2">
        <Input 
          placeholder="Search by name, bio, skills, or location..." 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="max-w-xl"
        />
        <Button type="submit" disabled={loading}>
          {loading ? 'Searching...' : <Search className="w-4 h-4 mr-2" />}
          Search
        </Button>
      </form>

      {error && <div className="text-red-500 font-medium">{error}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-sm flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4" />
                Ranking Weights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <Label className="text-xs">DevRank Score</Label>
                  <span className="text-xs text-muted-foreground">{weights.devRank}%</span>
                </div>
                <Slider 
                  value={[weights.devRank]} 
                  onValueChange={([val]) => setWeights(prev => ({ ...prev, devRank: val }))} 
                  max={100} step={5} 
                />
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <Label className="text-xs">GitHub Stars</Label>
                  <span className="text-xs text-muted-foreground">{weights.stars}%</span>
                </div>
                <Slider 
                  value={[weights.stars]} 
                  onValueChange={([val]) => setWeights(prev => ({ ...prev, stars: val }))} 
                  max={100} step={5} 
                />
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <Label className="text-xs">Recent Activity</Label>
                  <span className="text-xs text-muted-foreground">{weights.activity}%</span>
                </div>
                <Slider 
                  value={[weights.activity]} 
                  onValueChange={([val]) => setWeights(prev => ({ ...prev, activity: val }))} 
                  max={100} step={5} 
                />
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <Label className="text-xs">Follower Count</Label>
                  <span className="text-xs text-muted-foreground">{weights.followers}%</span>
                </div>
                <Slider 
                  value={[weights.followers]} 
                  onValueChange={([val]) => setWeights(prev => ({ ...prev, followers: val }))} 
                  max={100} step={5} 
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3">
          {results.length === 0 && !loading && !error && (
            <div className="text-center py-12 border-2 border-dashed rounded-lg text-muted-foreground">
              No developers found. Try a different search!
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {rankedResults.map((dev, i) => {
              const score = calculateScore(dev);
              const devId = String(dev.username || dev.id || dev.name);
              const isSaving = savingIds.has(devId);
              const isSaved = savedIds.has(devId);
              
              return (
                <Card key={devId || i} className="hover:shadow-md transition-shadow relative overflow-hidden">
                  <div className="absolute top-0 right-0 bg-zinc-900 dark:bg-zinc-100 text-zinc-50 dark:text-zinc-900 px-3 py-1 text-xs font-bold rounded-bl-lg">
                    Score: {score}
                  </div>

                  <CardHeader className="flex flex-row items-center gap-4 pt-6">
                    <Avatar className="h-12 w-12 border">
                      <AvatarImage src={dev.avatarUrl || dev.avatar_url} alt={dev.name} />
                      <AvatarFallback>{dev.name?.charAt(0) || dev.username?.charAt(0) || 'D'}</AvatarFallback>
                    </Avatar>
                    <div className="overflow-hidden">
                      <CardTitle className="text-lg truncate">{dev.name || dev.username}</CardTitle>
                      <p className="text-sm text-muted-foreground truncate">{dev.location || 'Unknown Location'}</p>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm line-clamp-2 mb-4 text-zinc-600 dark:text-zinc-400">
                      {dev.bio || 'No bio provided.'}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {dev.languages?.slice(0, 3).map((lang: string) => (
                        <Badge key={lang} variant="secondary" className="text-xs">{lang}</Badge>
                      ))}
                    </div>
                    <Button 
                      variant={isSaved ? "secondary" : "outline"} 
                      className="w-full text-xs h-8"
                      onClick={() => handleSaveCandidate(dev)}
                      disabled={isSaving || isSaved}
                    >
                      {isSaving ? "Saving..." : isSaved ? "Saved in Pipeline" : "Save Candidate"}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}