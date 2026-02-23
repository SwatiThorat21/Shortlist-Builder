import express from 'express';
import cors from 'cors';
import shortlistRoutes from './routes/shortlistRoutes.js';
import statusRoutes from './routes/statusRoutes.js';
import { config } from './config/index.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

const app = express();

app.set('trust proxy', config.trustProxy);
app.use(cors({ origin: config.frontendOrigin }));
app.use(express.json({ limit: `${config.maxRequestBodyKb}kb` }));

app.get('/health', (_req, res) => {
  res.json({ ok: true });
});

app.use('/api/shortlists', shortlistRoutes);
app.use('/api/status', statusRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
