# AI Notes

## Model Used
- Gemini AI Studio `gemini-2.0-flash`.
- Chosen for speed/cost balance and structured JSON extraction reliability.

## What AI Generated
- Vendor discovery candidates (3-5 max) with website/pricing/docs links.
- Structured extraction from scraped vendor text.

## What Was Manually Reviewed
- Deterministic scoring algorithm.
- URL and request validation logic.
- Error handling and structured response contracts.
- Database schema and API interfaces.

## Hallucination Risks
- Vendor existence and URL quality from model output can be wrong.
- Extracted claims can be incomplete if scrape text is sparse.
- Risk of over-generalized feature matching without explicit quotes.

## Data Validation Strategy
- Strict JSON parsing with Zod schemas.
- One repair retry on invalid LLM JSON.
- URL protocol validation (`http/https`) before scraping.
- Structured error response on invalid/failed extraction.
