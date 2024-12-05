import { z } from 'zod';

export const SearchQuerySchema = z.object({
  q: z.string().min(0),
  page: z.string().optional().transform(Number).default('1'),
  dateRange: z
    .object({
      start: z.string().optional().transform((str) => (str ? new Date(str) : undefined)),
      end: z.string().optional().transform((str) => (str ? new Date(str) : undefined))
    })
    .optional(),
  fileType: z.array(z.string()).optional(),
  minSize: z.string().optional().transform(Number),
  maxSize: z.string().optional().transform(Number),
});

export type SearchQueryType = z.infer<typeof SearchQuerySchema>;