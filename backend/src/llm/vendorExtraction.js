import { extractionSchema } from '../schemas/shortlistSchemas.js';
import { generateStructuredJson } from './geminiClient.js';
import { extractionPrompt, jsonRepairPrompt } from './prompts.js';
import { AppError } from '../utils/errors.js';

export async function extractVendorData({ need, requirements, scraped }) {
  const prompt = extractionPrompt({ need, requirements, scraped });
  let raw = await generateStructuredJson(prompt, { tag: 'vendor_extraction' });

  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      const parsed = JSON.parse(raw);
      return extractionSchema.parse(parsed);
    } catch {
      if (attempt === 1) break;
      raw = await generateStructuredJson(jsonRepairPrompt(prompt, raw), { tag: 'vendor_extraction_repair' });
    }
  }

  throw new AppError(502, 'LLM_INVALID_JSON', 'Vendor extraction JSON was invalid after retry');
}
