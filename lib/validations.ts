// lib/validations.ts
import { z } from 'zod';

export const candidateSchema = z.object({
  github_username: z.string().min(1, "GitHub username is required"),
  name: z.string().nullable().optional(),
  avatar_url: z.string().url().nullable().optional(),
  location: z.string().nullable().optional(),
  company: z.string().nullable().optional(),
  top_languages: z.array(z.string()).default([]),
  github_url: z.string().url("Must be a valid URL"),
  email: z.string().email("Invalid email format").nullable().optional().or(z.literal('')),
  notes: z.string().nullable().optional(),
});

// Derive the TypeScript type directly from the Zod schema (Rule: Don't define types separately)
export type CandidateInput = z.infer<typeof candidateSchema>;

// We'll use this one when fetching from the DB
export type SavedCandidate = CandidateInput & {
  id: string;
  created_at: string;
};