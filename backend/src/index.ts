import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { CONFIG } from './config';
import { limiter } from './middleware/rateLimit';
import { errorHandler } from './middleware/error';
import routes from './routes';
import { setupElasticsearch } from './services/elasticsearch';
import { startFileIndexing, startLongPolling } from './services/dropbox';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(limiter);

app.use('/api', routes);

app.use(errorHandler);

const start = async () => {
  try {
    await setupElasticsearch();
    await startFileIndexing();
    startLongPolling();

    const server = app.listen(CONFIG.port, () => {
      console.log(`Server running on port ${CONFIG.port}`);
    });

    // Graceful shutdown
    const shutdown = async () => {
      console.log('Shutting down gracefully...');
      server.close(() => {
        console.log('Server closed');
        process.exit(0);
      });
    };

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

start();