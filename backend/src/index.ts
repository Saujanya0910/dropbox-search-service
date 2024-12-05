import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { CONFIG } from './config';
import { limiter } from './middleware/rateLimit';
import { errorHandler } from './middleware/error';
import routes from './routes';
import { setupElasticsearch } from './services/elasticsearch';
import { startFileIndexing } from './services/dropbox';

const app = express();

app.use(helmet());
app.use(morgan('short'));
app.use(cors({
  origin: CONFIG.cors
}));
app.use(express.json());
app.use(limiter);
app.set('trust proxy', 1);

app.use('/api', routes);

app.use(errorHandler);

const start = async () => {
  try {
    await setupElasticsearch();

    // initial indexing
    startFileIndexing()
      .catch((error) => console.error('[SERVER] Error during file indexing:', error));

    // set up interval for subsequent indexing
    setInterval(() => {
      startFileIndexing()
        .catch((error) => console.error('[SERVER] Error during file indexing:', error));
    }, CONFIG.dropbox.indexingIntervalInSeconds);

    app.listen(CONFIG.port, () => {
      console.log(`[SERVER] Server running on port ${CONFIG.port}`);
    });

  } catch (error) {
    console.error('[SERVER] Failed to start server:', error);
    process.exit(1);
  }
};

start();