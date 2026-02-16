import { logger } from './logger.js';

export function logTokenUsage(tag, usage) {
  if (!usage) return;
  logger.info({ tag, usage }, 'LLM usage');
}
