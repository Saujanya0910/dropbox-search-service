import { Router } from 'express';
import searchRouter from './search.routes';
import healthRouter from './health.routes';
import webhookRouter from './webhook.routes';

const router = Router();

router.use('/search', searchRouter);
router.use('/health', healthRouter);
router.use('/webhook', webhookRouter);

export default router;