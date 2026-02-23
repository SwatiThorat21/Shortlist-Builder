import { Router } from 'express';
import {
  shortlistBuildRequestSchema,
  shortlistIdParamsSchema,
  shortlistListQuerySchema
} from '../schemas/shortlistSchemas.js';
import { validateBody, validateParams, validateQuery } from '../middleware/validateRequest.js';
import { buildShortlistRateLimit } from '../middleware/rateLimit.js';
import { buildShortlist, listShortlists, removeShortlist } from '../services/shortlistService.js';

const router = Router();

router.post('/build', buildShortlistRateLimit, validateBody(shortlistBuildRequestSchema), async (req, res, next) => {
  try {
    const response = await buildShortlist(req.validatedBody);
    res.json(response);
  } catch (error) {
    next(error);
  }
});

router.get('/', validateQuery(shortlistListQuerySchema), async (req, res, next) => {
  try {
    const records = await listShortlists(req.validatedQuery.limit);
    res.json({ items: records });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', validateParams(shortlistIdParamsSchema), async (req, res, next) => {
  try {
    await removeShortlist(req.validatedParams.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;
