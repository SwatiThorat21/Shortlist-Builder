import { config } from '../config/index.js';
import { discoverVendors } from '../llm/vendorDiscovery.js';
import { extractVendorData } from '../llm/vendorExtraction.js';
import { fetchAndExtract } from '../scraper/pageFetcher.js';
import { saveShortlist, fetchRecentShortlists, deleteShortlistById } from '../db/shortlistRepo.js';
import { AppError } from '../utils/errors.js';
import { rankVendors, scoreVendor } from './scoringService.js';

function validateHttpUrl(url) {
  try {
    const u = new URL(url);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
}

function dedupeByDomain(vendors) {
  const seen = new Set();
  const result = [];
  for (const vendor of vendors) {
    const domain = new URL(vendor.official_website).hostname.replace(/^www\./, '');
    if (!seen.has(domain)) {
      seen.add(domain);
      result.push(vendor);
    }
  }
  return result;
}

async function mapWithConcurrency(items, concurrency, mapper) {
  const output = [];
  let idx = 0;

  async function worker() {
    while (idx < items.length) {
      const i = idx;
      idx += 1;
      output[i] = await mapper(items[i], i);
    }
  }

  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, () => worker()));
  return output;
}

export async function buildShortlist({ need, requirements }) {
  const discovered = await discoverVendors({ need, requirements, maxVendors: config.maxVendors });
  const valid = dedupeByDomain(discovered)
    .filter((v) => [v.official_website, v.pricing_url, v.docs_url].every(validateHttpUrl))
    .slice(0, config.maxVendors);

  if (valid.length < 1) {
    throw new AppError(422, 'DISCOVERY_EMPTY', 'No valid vendors discovered');
  }

  const vendorResults = await mapWithConcurrency(valid, 3, async (vendor) => {
    try {
      const [pricingRes, docsRes] = await Promise.allSettled([
        fetchAndExtract(vendor.pricing_url),
        fetchAndExtract(vendor.docs_url)
      ]);

      const pricingText = pricingRes.status === 'fulfilled' ? pricingRes.value : '';
      const docsText = docsRes.status === 'fulfilled' ? docsRes.value : '';

      if (!pricingText && !docsText) {
        return null;
      }

      const extracted = await extractVendorData({
        need,
        requirements,
        scraped: {
          pricing_url: vendor.pricing_url,
          docs_url: vendor.docs_url,
          pricing_text: pricingText,
          docs_text: docsText
        }
      });

      const result = {
        name: vendor.vendor_name,
        website: vendor.official_website,
        ...extracted
      };

      return {
        ...result,
        score: scoreVendor({ vendor: result, requirements })
      };
    } catch {
      return null;
    }
  });

  const vendors = vendorResults.filter(Boolean);

  if (vendors.length < 1) {
    throw new AppError(422, 'SCRAPE_EMPTY', 'Unable to scrape and score any discovered vendors');
  }

  const ranking = rankVendors(vendors).map((v) => v.name);
  const shortlistPayload = { need, vendors, ranking };
  const saved = await saveShortlist({ need, requirements, results: shortlistPayload });

  return {
    shortlist_id: saved.id,
    ...shortlistPayload
  };
}

export async function listShortlists(limit) {
  return fetchRecentShortlists(limit);
}

export async function removeShortlist(id) {
  await deleteShortlistById(id);
}
