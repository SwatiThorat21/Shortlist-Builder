import { z } from 'zod';

const nonEmptyArray = z.array(z.string().trim().min(1));
const requirementWeightsSchema = z.object({
  budget: z.number().min(0).max(5),
  region: z.number().min(0).max(5),
  must_have: z.number().min(0).max(5),
  nice_to_have: z.number().min(0).max(5),
  team_size: z.number().min(0).max(5),
  compliance: z.number().min(0).max(5)
});

export const shortlistBuildRequestSchema = z.object({
  need: z.string().trim().min(1, 'Need is required'),
  requirements: z.object({
    budget_text: z.string().trim().min(1, 'Budget is required'),
    region: z.string().trim().optional().default(''),
    must_have_features: nonEmptyArray.default([]),
    nice_to_have_features: nonEmptyArray.default([]),
    team_size: z.string().trim().optional().default(''),
    compliance_constraints: nonEmptyArray.default([]),
    weights: requirementWeightsSchema.optional().default({
      budget: 3,
      region: 3,
      must_have: 5,
      nice_to_have: 2,
      team_size: 2,
      compliance: 3
    })
  })
});

export const discoveredVendorSchema = z.object({
  vendor_name: z.string().min(1),
  official_website: z.string().url(),
  pricing_url: z.string().url(),
  docs_url: z.string().url()
});

export const discoveredVendorsSchema = z.object({
  vendors: z.array(discoveredVendorSchema).min(3).max(5)
});

export const extractionSchema = z.object({
  price_range: z.string(),
  matched_features: z.array(z.string()),
  missing_features: z.array(z.string()),
  risks: z.array(z.string()),
  regional_support: z.string(),
  evidence: z.array(z.object({
    url: z.string().url(),
    quote: z.string().min(1)
  })).default([])
});
