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
- `RATE_LIMIT_USE_REDIS`
- `REDIS_URL`
- `TRUST_PROXY`
- `MAX_REQUEST_BODY_KB`
- `SCRAPE_MAX_BYTES`
- `SCRAPE_ALLOWED_CONTENT_TYPES`
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
  - User/IP keyed throttling with `Retry-After` response metadata
  - Request/error handling with consistent error responses
  - Strict input validation for body/query/params with bounded lengths
  - CORS configuration via `FRONTEND_ORIGIN`
  - Scraper guards for URL protocol, local/private address blocking, content-type checks, and response-size limits
  - Cache observability fields (`hit_count`, `last_hit_at`) and expired-cache cleanup path
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

## Production Readiness
- Validation strategy:
  - Request body schemas are strict (`zod`) with max lengths and bounded array sizes.
  - Query and path params are schema-validated before route handlers.
  - Malformed JSON and oversized payloads return explicit `400/413` errors.
- Rate limiting strategy:
  - Build endpoint is throttled with standard headers and `Retry-After`.
  - Client keying uses `x-user-id` when available, falling back to client IP.
  - `TRUST_PROXY` is configurable for deployments behind reverse proxies.
- Caching strategy:
  - Scraped page content is cached in `vendor_page_cache` with TTL (`expires_at`).
  - Cache hits can be tracked via `hit_count` and `last_hit_at`.
  - Expired rows can be purged by scheduled SQL cleanup.
- Test coverage:
  - Unit tests cover schema boundaries, scoring/normalization logic, and scraper guardrails.
  - Integration tests cover happy path, invalid input, service failures, and rate-limit behavior.
