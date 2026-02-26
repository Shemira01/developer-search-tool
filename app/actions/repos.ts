// app/actions/repos.ts
'use server'

import { Bountylab } from '@bountylab/bountylab';
import { z } from 'zod';

const apiKey = process.env.VITE_BOUNTYLAB_API_KEY || process.env.BOUNTYLAB_API_KEY;
if (!apiKey) throw new Error("Bountylab API key is missing");

const bounty = new Bountylab({ apiKey });

const repoSearchSchema = z.object({
  query: z.string().min(1, "Search query cannot be empty").max(200),
  language: z.string().optional().or(z.literal('')),
  minStars: z.number().int().min(0).default(0),
});

// Define an interface to safely type the unpatched SDK
type BountylabWithRepos = {
  repositories?: {
    search: (args: { query: string; language?: string; minStars: number; limit: number }) => Promise<unknown>
  }
};

export async function searchRepositories(rawInput: unknown) {
  const parsed = repoSearchSchema.safeParse(rawInput);
  
  if (!parsed.success) {
    return { 
      error: { 
        code: "VALIDATION_ERROR", 
        message: "Invalid search parameters", 
        details: parsed.error.flatten().fieldErrors 
      } 
    };
  }

  const { query, language, minStars } = parsed.data;

  try {
    const bountyInstance = bounty as unknown as BountylabWithRepos;
    if (!bountyInstance.repositories) {
      throw new Error("Repositories method not available on SDK");
    }

    const response = await bountyInstance.repositories.search({
      query,
      language: language || undefined,
      minStars,
      limit: 10
    });

    return { data: response };
  } catch (error) {
    console.error("Bountylab Repo Search Error:", error);
    return { 
      error: { 
        code: "INTERNAL_ERROR", 
        message: "Failed to fetch repositories from Bountylab" 
      } 
    };
  }
}