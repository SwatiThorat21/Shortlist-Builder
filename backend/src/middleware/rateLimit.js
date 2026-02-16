import rateLimit from 'express-rate-limit';
import { config } from '../config/index.js';

export const buildShortlistRateLimit = rateLimit({
  windowMs: config.rateLimitWindowMs,
  max: config.rateLimitMax,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, res) => {
    res.status(429).json({
      error: {
        code: 'UPSTREAM_RATE_LIMIT',
        message: 'Too many requests. Please retry later.',
        details: {}
      }
    });
  }
});
