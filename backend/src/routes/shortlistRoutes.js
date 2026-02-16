import { Router } from 'express';
import { z } from 'zod';
import { shortlistBuildRequestSchema } from '../schemas/shortlistSchemas.js';
import { validate } from '../middleware/validateRequest.js';
import { buildShortlistRateLimit } from '../middleware/rateLimit.js';
import { buildShortlist, listShortlists, removeShortlist } from '../services/shortlistService.js';

const router = Router();

router.post('/build', buildShortlistRateLimit, validate(shortlistBuildRequestSchema), async (req, res, next) => {
  try {
    const response = await buildShortlist(req.validatedBody);
    res.json(response);
  } catch (error) {
    next(error);
  }
});

router.get('/', async (req, res, next) => {
  try {
    const limit = Number(req.query.limit || 5);
    const records = await listShortlists(limit);
    res.json({ items: records });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    z.string().uuid().parse(req.params.id);
    await removeShortlist(req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;
