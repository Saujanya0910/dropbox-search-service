import { Router } from 'express';
import searchRouter from './search.routes';
import healthRouter from './health.routes';

const router = Router();

router.use('/search', searchRouter);
router.use('/health', healthRouter);

export default router;