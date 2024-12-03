import rateLimit from 'express-rate-limit';
import { CONFIG } from '../config';

export const limiter = rateLimit({
  windowMs: CONFIG.rateLimit.windowMs,
  max: CONFIG.rateLimit.max,
  message: 'Too many requests from this IP, please try again later.',
});