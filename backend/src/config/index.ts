import { config } from 'dotenv';
import { z } from 'zod';

config();

const envSchema = z.object({
  PORT: z.string().default('3000'),
  ELASTICSEARCH_URL: z.string(),
  ELASTICSEARCH_API_KEY: z.string(),
  DROPBOX_ACCESS_TOKEN: z.string(),
  RATE_LIMIT_WINDOW_MS: z.string().default('900000'),
  RATE_LIMIT_MAX_REQUESTS: z.string().default('100'),
  CACHE_TTL: z.string().default('3600'),
});

const env = envSchema.parse(process.env);

export const CONFIG = {
  port: parseInt(env.PORT, 10),
  elasticsearch: {
    url: env.ELASTICSEARCH_URL,
    apiKey: env.ELASTICSEARCH_API_KEY,
  },
  dropbox: {
    accessToken: env.DROPBOX_ACCESS_TOKEN,
  },
  rateLimit: {
    windowMs: parseInt(env.RATE_LIMIT_WINDOW_MS, 10),
    max: parseInt(env.RATE_LIMIT_MAX_REQUESTS, 10),
  },
  cache: {
    ttl: parseInt(env.CACHE_TTL, 10),
  },
} as const;