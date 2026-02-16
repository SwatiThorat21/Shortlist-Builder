# Vendor Discovery + Shortlist Builder

App that discovers vendors from a use-case prompt, scrapes public pricing/docs pages, extracts structured evidence with Gemini, scores vendors, and stores shortlist history in Supabase.

## Tech Stack
- Frontend: React + Vite
- Backend: Node.js + Express + Axios + Cheerio
- Database: Supabase Postgres (JSONB)
- LLM: Gemini AI Studio (`gemini-2.0-flash` by default)
- Validation: Zod

## Project Structure
- `frontend/`: React app (form, results table, history, status page, markdown export)
- `backend/`: API routes + discovery/scrape/extract/score pipeline
- `supabase/schema.sql`: SQL schema for shortlist + cache tables

## How To Run
1. Install dependencies from repo root:
   ```bash
   npm install
   ```
2. Create `.env` from `.env.example` and fill values.
3. Apply DB schema in Supabase SQL editor:
   ```sql
   -- run file: supabase/schema.sql
   ```
4. Start backend and frontend:
   ```bash
   npm run dev:backend
   npm run dev:frontend
   ```
5. Optional (single command for both):
   ```bash
   npm run dev
   ```

## Environment Variables
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

## API Endpoints
- `POST /api/shortlists/build`: Discover, scrape, extract, score, persist shortlist
- `GET /api/shortlists?limit=5`: Get recent shortlist history
- `DELETE /api/shortlists/:id`: Delete one shortlist item
- `GET /api/status`: Service health + latency checks (`express`, `supabase`, `gemini`)
- `GET /health`: Basic backend health

## What Is Done
- End-to-end shortlist pipeline:
  - Input validation with Zod
  - Vendor discovery with Gemini structured output
  - URL validation + domain dedupe
  - Scraping pricing/docs pages
  - Structured extraction from scraped text
  - Deterministic scoring + ranking
  - Save shortlist in Supabase
- Frontend flow:
  - Requirement form (need, budget, region, must-have, nice-to-have, team size, compliance)
  - Loading/progress states
  - Results comparison table
  - Markdown export for results
  - History page (list, open, delete)
  - Status page for service checks
- Reliability and guardrails:
  - Rate limit on shortlist build route
  - Request/error handling with consistent error responses
  - CORS configuration via `FRONTEND_ORIGIN`
  - Tests for key backend/frontend units and integration paths

## What Is Not Done Yet
- No authentication/authorization (history is global).
- No per-user/project tenancy model.
- No streaming progress from backend (frontend progress is simulated).
- No background job queue/retry workflow for long-running builds.
- Scraping is best-effort and can fail on JS-heavy/blocked pages.
- Budget interpretation is heuristic (free-text normalization).

## Testing
- Run all tests:
  ```bash
  npm run test
  ```
- Backend only:
  ```bash
  npm run test -w backend
  ```
- Frontend only:
  ```bash
  npm run test -w frontend
  ```

## Security Notes
- Keep `SUPABASE_SERVICE_ROLE_KEY` server-side only.
- Restrict frontend origin with `FRONTEND_ORIGIN`.
- Keep Gemini/Supabase secrets in `.env`, never in frontend code.
