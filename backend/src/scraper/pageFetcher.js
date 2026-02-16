import axios from 'axios';
import { config } from '../config/index.js';
import { AppError } from '../utils/errors.js';
import { extractTextFromHtml } from './contentExtractor.js';
import { getCachedPage, setCachedPage } from '../db/cacheRepo.js';

export async function fetchAndExtract(url) {
  const cached = await getCachedPage(url);
  if (cached) return cached;

  try {
    const response = await axios.get(url, {
      timeout: config.requestTimeoutMs,
      headers: {
        'User-Agent': 'VendorShortlistBot/1.0'
      }
    });
    const text = extractTextFromHtml(response.data, config.scrapeMaxChars);
    await setCachedPage(url, text, config.cacheTtlMinutes);
    return text;
  } catch (error) {
    throw new AppError(502, 'SCRAPE_ERROR', `Failed to scrape ${url}`, {
      reason: String(error?.message || 'Unknown scrape error')
    });
  }
}
