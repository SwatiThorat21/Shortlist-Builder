import { discoveredVendorsSchema } from '../schemas/shortlistSchemas.js';
import { generateStructuredJson } from './geminiClient.js';
import { jsonRepairPrompt, vendorDiscoveryPrompt } from './prompts.js';
import { AppError } from '../utils/errors.js';

export async function discoverVendors({ need, requirements, maxVendors }) {
  const prompt = vendorDiscoveryPrompt({ need, requirements, maxVendors });
  let raw = await generateStructuredJson(prompt, { tag: 'vendor_discovery' });

  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      const parsed = JSON.parse(raw);
      const validated = discoveredVendorsSchema.parse(parsed);
      return validated.vendors;
    } catch {
      if (attempt === 1) break;
      raw = await generateStructuredJson(jsonRepairPrompt(prompt, raw), { tag: 'vendor_discovery_repair' });
    }
  }

  throw new AppError(502, 'LLM_INVALID_JSON', 'Vendor discovery JSON was invalid after retry');
}
