# Prompts Used

## Sequential Prompt Log

1. `[System] Vendor Discovery Prompt`
   You are a vendor discovery assistant.
   Project context:
   - Frontend: ReactJS
   - Backend: Node.js
   - Database: Supabase (Postgres)
   Gemini integration steps:
   - Add and validate `GEMINI_API_KEY` and `GEMINI_MODEL` in backend environment config.
   - Initialize Gemini client server-side (never from frontend).
   - Create prompt templates for vendor discovery and strict JSON output.
   - Validate Gemini responses with schema checks and add one JSON-repair retry path.
   - Persist validated shortlist results to Supabase.
   Find up to MAX_VENDORS serious software vendors for a business need.
   Inputs:
   - Need text
   - Requirements JSON
   Return STRICT JSON only:
   {
     "vendors": [
       {
         "vendor_name": "string",
         "official_website": "https://...",
         "pricing_url": "https://...",
         "docs_url": "https://..."
       }
     ]
   }
   Rules:
   - 3-5 relevant vendors
   - URLs must be real http links
   - no markdown/explanations

2. `[System] Structured Extraction Prompt`
   You are a structured extraction assistant.
   Inputs:
   - Need
   - Requirements JSON
   - Scraped pricing/docs text
   Return STRICT JSON only:
   {
     "price_range": "string",
     "matched_features": ["..."],
     "missing_features": ["..."],
     "risks": ["..."],
     "regional_support": "string",
     "evidence": [
       {"url": "https://...", "quote": "string"}
     ]
   }
   Rules:
   - Use only scraped content
   - Keep evidence quotes short
   - no markdown/explanations

3. `[System] JSON Repair Retry Prompt`
   The previous output was invalid JSON for the required schema.
   Given the original prompt and invalid output, return ONLY valid JSON matching the required schema.

4. `[User]` Improve the UI of my web app form using modern styling and better layout. The current form (attached screenshot) is plain. I want a clean, responsive design with spacing, icons, input groups, and a visually appealing submit button.
   Requirements:
   - Use React + Tailwind CSS
   - Add interactive focus states
   - Make it mobile responsive
   - Add placeholder enhancements
   - Make the submit button stand out

5. `[Assistant-generated prompt]`
   Integrate Google Gemini API for AI responses and connect it properly with Supabase in this Node.js + React project. Implement secure server-side Gemini calls, validate and store structured response payloads in Supabase, add robust error handling and rate-limit-aware retries, and expose clean API endpoints for frontend consumption. Ensure `.env` configuration, CORS, and service-role key safety are handled correctly. Include test coverage for API success/failure cases and provide setup steps for local and production environments.

6. `[User]` how to connect gemini and supabase to current project

7. `[User]` I want to run this project can you tell me frontend and backend commands to run

8. `[User]` can you update the readme according to current updated code, in readme requirement weights is included but I am not using it now, also make sure below details should be there how to run, what is done, what is not done

9. `[User]` in the ABOUTME.md is it possible to add pdf resume

10. `[User]` C:\Users\Admin\OneDrive\Desktop\SwatiThoratResume.pdf

11. `[User]` I have updated ABOUTME.md can format it

12. `[User]` can you tell me steps to deploy this app
