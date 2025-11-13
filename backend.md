# Backend architecture

AetherLearn stays 100% free by leaning on a managed, usage-based stack that has a generous free tier. The current client is wired to talk to a Supabase project that provides:

- **Supabase Postgres + Row Level Security** for storing study folders, generation jobs, and quiz history without writing boilerplate auth logic.
- **Supabase Storage** (bucket name `study-uploads`) for hosting the PDFs and images that learners upload from the Create tab.
- **Edge Functions** exposed at `https://your-project.functions.supabase.co` that wrap our AI workflows. The Expo client hits the `/generator/flashcards` and `/generator/quiz` routes already defined in `app/src/api/hooks.ts`.
- **pgvector & OpenAI-compatible models** (for example, Supabase AI with GPT-4o mini) to extract concepts from the uploaded files and synthesize flashcards/quizzes on demand.

## Recommended implementation details

1. **Authentication** – Use Supabase Auth with magic links so students can sign in without passwords. The Expo app can load the anon key from secure storage and attach the JWT when calling Edge Functions.
2. **Folder ingestion flow** – When a learner adds files to a folder, upload them directly to Supabase Storage (path pattern `folders/{folderId}/{filename}`). Save the metadata in a `study_folders` table with a `files` child table referencing each upload.
3. **AI generation** – Edge Functions receive the folder ID, download the referenced files from Storage, run OCR/vectorization, and generate structured flashcards plus quiz questions. Persist the results so repeated runs stay free by reusing cached content.
4. **Cost controls** – Schedule a nightly job that summarizes token usage per user. Because Supabase’s free tier includes generous storage (1 GB) and Edge Function compute, keeping uploads under 100 MB per folder maintains a $0 bill.
5. **Real-time updates** – Use Supabase Realtime to broadcast when an AI job finishes so the Practice tab refreshes automatically.
6. **Review telemetry** – Store spaced-repetition events (`ease_factor`, `interval_days`, `next_review_at`) in a `flashcard_reviews` table so folder mastery dashboards and collaborator activity feeds stay in sync across devices.
7. **Supporter pledges** – Track optional donation intents in a lightweight `supporter_waitlist` table so the product can invite learners to contribute later without affecting the free core experience. When you introduce payments, route them through Stripe Checkout or Supabase Functions to capture recurring pledges securely.

## Local configuration

Set the following environment variables for development builds (e.g., via `app.config.ts` or `dotenv`):

```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
EXPO_PUBLIC_FUNCTIONS_URL=https://your-project.functions.supabase.co
```

Then update `Constants.expoConfig.extra` in `app/app.json` (or `app.config.ts`) to read these values so `apiClient` routes requests to the correct backend during development and production.
