// app/actions/bounty.ts
'use server'

import { Bountylab } from '@bountylab/bountylab';
import { z } from 'zod';

const apiKey = process.env.VITE_BOUNTYLAB_API_KEY || process.env.BOUNTYLAB_API_KEY;
if (!apiKey) throw new Error("Bountylab API key is missing");

const bounty = new Bountylab({ apiKey });

const searchInputSchema = z.object({
  query: z.string().min(1, "Search query cannot be empty").max(100),
  page: z.number().int().min(1).default(1),
});

// Define an interface to safely type the unpatched SDK method
type BountylabWithSearch = {
  search?: {
    developers: (args: { query: string; page: number; limit: number }) => Promise<unknown>
  }
};

export async function searchDevelopers(rawInput: unknown) {
  const parsed = searchInputSchema.safeParse(rawInput);
  
  if (!parsed.success) {
    return { 
      error: { 
        code: "VALIDATION_ERROR", 
        message: "Invalid search parameters", 
        details: parsed.error.flatten().fieldErrors 
      } 
    };
  }

  const { query, page } = parsed.data;

  try {
    const bountyInstance = bounty as unknown as BountylabWithSearch;
    
    if (!bountyInstance.search) {
      throw new Error("Search method not available on SDK");
    }

    const response = await bountyInstance.search.developers({
      query,
      page,
      limit: 10
    });

    return { data: response };
  } catch (error) {
    console.error("Bountylab Search Error:", error);
    return { 
      error: { 
        code: "INTERNAL_ERROR", 
        message: "Failed to fetch developers from Bountylab" 
      } 
    };
  }
}