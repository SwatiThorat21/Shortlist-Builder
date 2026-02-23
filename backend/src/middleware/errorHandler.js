import { AppError } from '../utils/errors.js';
import { logger } from '../utils/logger.js';

export function notFoundHandler(_req, _res, next) {
  next(new AppError(404, 'NOT_FOUND', 'Endpoint not found'));
}

export function errorHandler(err, _req, res, _next) {
  if (err?.type === 'entity.too.large') {
    return res.status(413).json({
      error: {
        code: 'PAYLOAD_TOO_LARGE',
        message: 'Request body is too large',
        details: {}
      }
    });
  }

  if (err instanceof SyntaxError && err?.status === 400 && 'body' in err) {
    return res.status(400).json({
      error: {
        code: 'INVALID_JSON',
        message: 'Malformed JSON payload',
        details: {}
      }
    });
  }

  if (err instanceof AppError) {
    if (typeof err.details?.retryAfterSeconds === 'number' && Number.isFinite(err.details.retryAfterSeconds)) {
      res.set('Retry-After', String(err.details.retryAfterSeconds));
    }
    return res.status(err.status).json({ error: { code: err.code, message: err.message, details: err.details } });
  }

  logger.error({ err }, 'Unhandled error');
  return res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Internal server error', details: {} } });
}
