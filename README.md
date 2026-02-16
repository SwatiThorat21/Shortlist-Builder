# Vendor Discovery + Shortlist Builder

Production-ready web app to discover vendors, scrape public pricing/docs pages, extract structured evidence with Gemini, score deterministically, and persist shortlists in Supabase.

## Tech Stack
- Frontend: React + Vite (functional components)
- Backend: Node.js + Express + Axios + Cheerio
- Database: Supabase Postgres (JSONB)
- LLM: Gemini AI Studio (`gemini-2.0-flash`)
- Validation: Zod
- Environment: dotenv

## Monorepo Layout
- `frontend/` UI app
- `backend/` API + orchestration pipeline
- `supabase/schema.sql` database schema
- `README.md`, `AI_NOTES.md`, `PROMPTS_USED.md`, `ABOUTME.md`

## Setup
1. Install dependencies:
   ```bash
   npm install
   npm install -w backend
   npm install -w frontend
   ```
2. Create `.env` from `.env.example` and set values.
3. Apply SQL schema in Supabase SQL editor using `supabase/schema.sql`.
4. Start locally:
   ```bash
   npm run dev:backend
   npm run dev:frontend
   ```

## Required Environment Variables
- `PORT`
- `FRONTEND_ORIGIN`
- `GEMINI_API_KEY`
- `GEMINI_MODEL`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `CACHE_TTL_MINUTES`
- `REQUEST_TIMEOUT_MS`
- `SCRAPE_MAX_CHARS`
- `MAX_VENDORS`
- `RATE_LIMIT_WINDOW_MS`
- `RATE_LIMIT_MAX`
- `VITE_API_BASE_URL`

## API Summary
- `POST /api/shortlists/build` build and save shortlist
- `GET /api/shortlists?limit=5` fetch recent shortlists
- `DELETE /api/shortlists/:id` delete shortlist
- `GET /api/status` service health and latency checks

## Architecture Overview
1. Validate user input and requirement weights.
2. Discover vendors via Gemini structured JSON output.
3. Scrape pricing/docs pages (Axios + Cheerio) with cache table.
4. Extract structured vendor fields via Gemini structured JSON output.
5. Deterministically score and rank vendors in backend code.
6. Persist shortlist and serve history.

## Testing
- Backend:
  ```bash
  npm run test -w backend
  ```
- Frontend:
  ```bash
  npm run test -w frontend
  ```
- All:
  ```bash
  npm run test
  ```

## Known Limitations
- Budget is free-text and normalized heuristically.
- Scraping quality depends on website HTML structure and access controls.
- No auth in MVP; history is global.

## Assumptions
- Public vendor pages are legally accessible to scrape.
- Gemini returns schema-compatible JSON after max one repair retry.
- Supabase service role key is server-side only.

## Security Notes
- Do not expose `SUPABASE_SERVICE_ROLE_KEY` in frontend.
- Restrict CORS via `FRONTEND_ORIGIN`.
- Rate limiting is enabled on shortlist build endpoint.
- All LLM output is validated before storage.
