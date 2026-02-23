import axios from 'axios';
import dns from 'dns/promises';
import net from 'net';
import { config } from '../config/index.js';
import { AppError } from '../utils/errors.js';
import { extractTextFromHtml } from './contentExtractor.js';
import { getCachedPage, setCachedPage } from '../db/cacheRepo.js';
import { logger } from '../utils/logger.js';

const blockedHostnames = new Set(['localhost', '127.0.0.1', '0.0.0.0', '::1']);

function isPrivateIp(ip) {
  const version = net.isIP(ip);
  if (version === 4) {
    const [a, b] = ip.split('.').map((v) => Number(v));
    return a === 10
      || a === 127
      || (a === 169 && b === 254)
      || (a === 172 && b >= 16 && b <= 31)
      || (a === 192 && b === 168);
  }
  if (version === 6) {
    const normalized = ip.toLowerCase();
    return normalized === '::1'
      || normalized.startsWith('fc')
      || normalized.startsWith('fd')
      || normalized.startsWith('fe80');
  }
  return false;
}

async function validateScrapeUrl(url) {
  let parsed;
  try {
    parsed = new URL(url);
  } catch {
    throw new AppError(400, 'INVALID_URL', 'Scrape URL is invalid');
  }

  if (!['http:', 'https:'].includes(parsed.protocol)) {
    throw new AppError(400, 'INVALID_URL', 'Only http/https URLs are allowed');
  }

  const hostname = parsed.hostname.toLowerCase();
  if (blockedHostnames.has(hostname) || isPrivateIp(hostname)) {
    throw new AppError(400, 'SCRAPE_URL_BLOCKED', 'Private or local addresses are not allowed');
  }

  try {
    const records = await dns.lookup(hostname, { all: true, verbatim: true });
    if (records.some((record) => isPrivateIp(record.address))) {
      throw new AppError(400, 'SCRAPE_URL_BLOCKED', 'Resolved private/local address is not allowed');
    }
  } catch (error) {
    if (error instanceof AppError) throw error;
  }
}

function assertAllowedContentType(url, contentTypeHeader) {
  const contentType = String(contentTypeHeader || '').toLowerCase();
  const isAllowed = config.scrapeAllowedContentTypes.some((allowed) => contentType.includes(allowed));
  if (!isAllowed) {
    throw new AppError(415, 'SCRAPE_CONTENT_TYPE_UNSUPPORTED', `Unsupported content type for ${url}`, {
      contentType
    });
  }
}

export async function fetchAndExtract(url) {
  await validateScrapeUrl(url);

  const start = Date.now();
  const cached = await getCachedPage(url);
  if (cached) {
    logger.debug({ url, cache_hit: true }, 'Scrape cache hit');
    return cached;
  }

  try {
    const response = await axios.get(url, {
      timeout: config.requestTimeoutMs,
      maxContentLength: config.scrapeMaxBytes,
      maxBodyLength: config.scrapeMaxBytes,
      validateStatus: (status) => status >= 200 && status < 400,
      headers: {
        'User-Agent': 'VendorShortlistBot/1.0'
      }
    });
    assertAllowedContentType(url, response.headers?.['content-type']);
    const text = extractTextFromHtml(response.data, config.scrapeMaxChars);
    await setCachedPage(url, text, config.cacheTtlMinutes);
    logger.info({
      url,
      cache_hit: false,
      fetch_ms: Date.now() - start,
      response_bytes: Buffer.byteLength(String(response.data || ''), 'utf8')
    }, 'Scraped vendor content');
    return text;
  } catch (error) {
    if (error instanceof AppError) throw error;

    throw new AppError(502, 'SCRAPE_ERROR', `Failed to scrape ${url}`, {
      reason: String(error?.message || 'Unknown scrape error')
    });
  }
}
