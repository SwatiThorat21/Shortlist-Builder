import { z } from 'zod';

function isHttpUrl(value) {
  try {
    const parsed = new URL(value);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

const textItemSchema = z.string().trim().min(1).max(120);
const boundedText = (max, requiredMessage) => z.string().trim().min(1, requiredMessage).max(max);
const optionalBoundedText = (max) => z.string().trim().max(max).optional().default('');
const boundedTextArray = z.array(textItemSchema).max(20).default([]);
const httpUrlSchema = z.string().url().refine(isHttpUrl, 'URL must use http or https');

const requirementWeightsSchema = z.object({
  budget: z.number().min(0).max(5),
  region: z.number().min(0).max(5),
  must_have: z.number().min(0).max(5),
  nice_to_have: z.number().min(0).max(5),
  team_size: z.number().min(0).max(5),
  compliance: z.number().min(0).max(5)
}).strict();

export const shortlistBuildRequestSchema = z.object({
  need: boundedText(2000, 'Need is required'),
  requirements: z.object({
    budget_text: boundedText(200, 'Budget is required'),
    region: optionalBoundedText(120),
    must_have_features: boundedTextArray,
    nice_to_have_features: boundedTextArray,
    team_size: optionalBoundedText(80),
    compliance_constraints: boundedTextArray,
    weights: requirementWeightsSchema.optional().default({
      budget: 3,
      region: 3,
      must_have: 5,
      nice_to_have: 2,
      team_size: 2,
      compliance: 3
    })
  }).strict()
}).strict();

export const discoveredVendorSchema = z.object({
  vendor_name: z.string().trim().min(1).max(120),
  official_website: httpUrlSchema,
  pricing_url: httpUrlSchema,
  docs_url: httpUrlSchema
}).strict();

export const discoveredVendorsSchema = z.object({
  vendors: z.array(discoveredVendorSchema).min(3).max(5)
}).strict();

export const extractionSchema = z.object({
  price_range: z.string().trim().max(200),
  matched_features: z.array(textItemSchema).max(30),
  missing_features: z.array(textItemSchema).max(30),
  risks: z.array(textItemSchema).max(30),
  regional_support: z.string().trim().max(200),
  evidence: z.array(z.object({
    url: httpUrlSchema,
    quote: z.string().trim().min(1).max(500)
  }).strict()).max(15).default([])
}).strict();

export const shortlistListQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(20).optional().default(5)
}).strict();

export const shortlistIdParamsSchema = z.object({
  id: z.string().uuid()
}).strict();
