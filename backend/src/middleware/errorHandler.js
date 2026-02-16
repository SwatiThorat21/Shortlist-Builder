import { AppError } from '../utils/errors.js';
import { logger } from '../utils/logger.js';

export function notFoundHandler(_req, _res, next) {
  next(new AppError(404, 'NOT_FOUND', 'Endpoint not found'));
}

export function errorHandler(err, _req, res, _next) {
  if (err instanceof AppError) {
    if (typeof err.details?.retryAfterSeconds === 'number' && Number.isFinite(err.details.retryAfterSeconds)) {
      res.set('Retry-After', String(err.details.retryAfterSeconds));
    }
    return res.status(err.status).json({ error: { code: err.code, message: err.message, details: err.details } });
  }

  logger.error({ err }, 'Unhandled error');
  return res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Internal server error', details: {} } });
}
