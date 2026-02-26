# DevHunter - Developer Search & Pipeline Tool

DevHunter is a full-stack Next.js application designed for recruiters to discover, rank, and pipeline top developer talent using the Bountylab API.

## 🚀 Features
* **Developer Search:** Full-text search for developers with an intelligent ranking system.
* **Dynamic Scoring:** Adjust weights for DevRank, GitHub Stars, Activity, and Followers to calculate a custom composite score.
* **Repository Discovery:** Semantic search for codebases to pivot from interesting projects to the developers who built them.
* **Candidate Pipeline:** Securely save developers to a database (Supabase), add custom notes, and manage your outreach.
* **CSV Export:** Export your pipeline with one click for external ATS integrations.

## 🛠️ Tech Stack
* **Framework:** Next.js (App Router)
* **Database & Auth:** Supabase (PostgreSQL)
* **Styling:** Tailwind CSS + shadcn/ui
* **Validation:** Zod (Strict server-side validation)
* **Package Manager:** pnpm

## 📦 Local Setup Instructions

1. **Clone the repository:**
   \`\`\`bash
   git clone <your-repo-url>
   cd developer-search-tool
   \`\`\`

2. **Install dependencies:**
   \`\`\`bash
   pnpm install
   \`\`\`

3. **Set up environment variables:**
   Create a \`.env.local\` file in the root directory and add your keys:
   \`\`\`env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_BOUNTYLAB_API_KEY=your_bountylab_api_key
   \`\`\`

4. **Set up the Database:**
   Run the following SQL in your Supabase SQL Editor to create the pipeline table:
   \`\`\`sql
   create table public.saved_candidates (
     id uuid default gen_random_uuid() primary key,
     github_username text not null unique,
     name text,
     avatar_url text,
     location text,
     company text,
     top_languages text[],
     github_url text not null,
     email text,
     notes text,
     created_at timestamp with time zone default timezone('utc'::text, now()) not null
   );
   \`\`\`

5. **Run the development server:**
   \`\`\`bash
   pnpm run dev
   \`\`\`
   Open [http://localhost:3000](http://localhost:3000) to view the app.

*(Don't forget to add a screenshot or GIF of the app running here before you submit!)*