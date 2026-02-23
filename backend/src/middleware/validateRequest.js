import { AppError } from '../utils/errors.js';

function buildValidationError(parsedError) {
  return new AppError(400, 'VALIDATION_ERROR', 'Invalid request payload', { issues: parsedError.issues });
}

function createValidator(schema, selectInput, targetKey) {
  return (req, _res, next) => {
    const parsed = schema.safeParse(selectInput(req));
    if (!parsed.success) {
      return next(buildValidationError(parsed.error));
    }
    req[targetKey] = parsed.data;
    return next();
  };
}

export const validateBody = (schema) => createValidator(schema, (req) => req.body, 'validatedBody');
export const validateQuery = (schema) => createValidator(schema, (req) => req.query, 'validatedQuery');
export const validateParams = (schema) => createValidator(schema, (req) => req.params, 'validatedParams');
export const validate = validateBody;
