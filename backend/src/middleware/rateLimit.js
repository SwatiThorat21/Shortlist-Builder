import rateLimit from 'express-rate-limit';
import { config } from '../config/index.js';

export const buildShortlistRateLimit = rateLimit({
  windowMs: config.rateLimitWindowMs,
  max: config.rateLimitMax,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    const userId = req.get('x-user-id')?.trim();
    if (userId) return `user:${userId}`;
    return `ip:${req.ip || req.socket?.remoteAddress || 'unknown'}`;
  },
  handler: (req, res) => {
    const resetEpochMs = req.rateLimit?.resetTime?.getTime?.();
    const retryAfterSeconds = Math.max(
      1,
      Math.ceil(((resetEpochMs ? resetEpochMs - Date.now() : config.rateLimitWindowMs)) / 1000)
    );
    res.set('Retry-After', String(retryAfterSeconds));
    res.status(429).json({
      error: {
        code: 'RATE_LIMITED',
        message: 'Too many requests. Please retry later.',
        details: { retryAfterSeconds }
      }
    });
  }
});
