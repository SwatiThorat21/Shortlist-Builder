export function vendorDiscoveryPrompt({ need, requirements, maxVendors }) {
  return `You are a vendor discovery assistant.\nFind ${maxVendors} or fewer serious software vendors for this business need.\nNeed: ${need}\nRequirements JSON: ${JSON.stringify(requirements)}\nReturn STRICT JSON only with format:\n{\n  "vendors": [\n    {\n      "vendor_name": "string",\n      "official_website": "https://...",\n      "pricing_url": "https://...",\n      "docs_url": "https://..."\n    }\n  ]\n}\nRules:\n- Return 3-5 relevant vendors\n- URLs must be real http links\n- No markdown\n- No explanations`;
}

export function extractionPrompt({ need, requirements, scraped }) {
  return `You are a structured extraction assistant.\nNeed: ${need}\nRequirements JSON: ${JSON.stringify(requirements)}\nScraped content JSON: ${JSON.stringify(scraped)}\nReturn STRICT JSON only with format:\n{\n  "price_range": "string",\n  "matched_features": ["..."],\n  "missing_features": ["..."],\n  "risks": ["..."],\n  "regional_support": "string",\n  "evidence": [\n    {"url": "https://...", "quote": "string"}\n  ]\n}\nRules:\n- Use only scraped content\n- Keep evidence quotes short and precise\n- No markdown\n- No explanations`;
}

export function jsonRepairPrompt(originalPrompt, invalidResponse) {
  return `The previous output was invalid JSON for the required schema.\nOriginal prompt:\n${originalPrompt}\nInvalid output:\n${invalidResponse}\nReturn ONLY valid JSON matching the required schema.`;
}
