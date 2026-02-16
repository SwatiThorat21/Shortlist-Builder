import { AppError } from '../utils/errors.js';

export function validate(schema) {
  return (req, _res, next) => {
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      return next(new AppError(400, 'VALIDATION_ERROR', 'Invalid request body', { issues: parsed.error.issues }));
    }
    req.validatedBody = parsed.data;
    return next();
  };
}
