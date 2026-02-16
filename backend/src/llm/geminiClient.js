import { GoogleGenerativeAI } from '@google/generative-ai';
import { config } from '../config/index.js';
import { AppError } from '../utils/errors.js';
import { logTokenUsage } from '../utils/tokenUsage.js';

const genAI = new GoogleGenerativeAI(config.geminiApiKey);

export async function generateStructuredJson(prompt, { tag }) {
  try {
    const model = genAI.getGenerativeModel({ model: config.geminiModel });
    const start = Date.now();
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.2
      }
    });

    const text = result.response.text();
    const latencyMs = Date.now() - start;
    const usage = result.response.usageMetadata
      ? {
        promptTokenCount: result.response.usageMetadata.promptTokenCount,
        candidatesTokenCount: result.response.usageMetadata.candidatesTokenCount,
        totalTokenCount: result.response.usageMetadata.totalTokenCount,
        latencyMs
      }
      : { latencyMs };
    logTokenUsage(tag, usage);
    return text;
  } catch (error) {
    const msg = String(error?.message || 'Gemini request failed');
    const retryInMatch = msg.match(/retry in\s+([\d.]+)s/i);
    const retryDelayMatch = msg.match(/"retryDelay":"(\d+)s"/i);
    const retryAfterSeconds = retryInMatch
      ? Math.ceil(Number(retryInMatch[1]))
      : retryDelayMatch
        ? Number(retryDelayMatch[1])
        : undefined;

    if (/too many requests|quota exceeded|rate limit|\b429\b/i.test(msg)) {
      throw new AppError(
        429,
        'GEMINI_RATE_LIMIT',
        'Gemini quota exceeded or rate limited. Retry shortly, or check plan/billing.',
        { reason: msg, retryAfterSeconds }
      );
    }
    if (/api key|permission|unauthorized|auth/i.test(msg)) {
      throw new AppError(401, 'GEMINI_AUTH_ERROR', 'Invalid Gemini API key', { reason: msg });
    }
    if (/timeout|timed out|deadline/i.test(msg)) {
      throw new AppError(504, 'GEMINI_TIMEOUT', 'Gemini request timed out', { reason: msg });
    }
    throw new AppError(502, 'GEMINI_UPSTREAM_ERROR', 'Gemini request failed', { reason: msg });
  }
}

export async function checkGeminiHealth() {
  const model = genAI.getGenerativeModel({ model: config.geminiModel });
  const start = Date.now();
  await model.generateContent({
    contents: [{ role: 'user', parts: [{ text: 'Reply with JSON: {"ok": true}' }] }],
    generationConfig: { responseMimeType: 'application/json', temperature: 0 }
  });
  return Date.now() - start;
}
