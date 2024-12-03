import { Router } from 'express';
import { z } from 'zod';
import { searchDocuments } from '../services/elasticsearch';
import { getDropboxUrl } from '../services/dropbox';
import NodeCache from 'node-cache';
import { CONFIG } from '../config';

const router = Router();
const cache = new NodeCache({ stdTTL: CONFIG.cache.ttl });

const searchQuerySchema = z.object({
  q: z.string().min(1),
  page: z.string().optional().transform(Number).default('1'),
  dateRange: z
    .object({
      start: z.string().transform((str) => new Date(str)),
      end: z.string().transform((str) => new Date(str)),
    })
    .optional(),
  fileType: z.array(z.string()).optional(),
  minSize: z.string().optional().transform(Number),
  maxSize: z.string().optional().transform(Number),
});

router.get('/', async (req, res) => {
  try {
    const query = searchQuerySchema.parse(req.query);
    const cacheKey = `search:${JSON.stringify(query)}`;
    
    const cachedResult = cache.get(cacheKey);
    if (cachedResult) {
      return res.json(cachedResult);
    }

    const searchResponse = await searchDocuments(query);
    
    const results = await Promise.all(
      searchResponse.hits.hits.map(async (hit) => {
        const source = hit._source as any;
        const dropboxUrl = await getDropboxUrl(source.dropboxPath);
        
        return {
          id: hit._id,
          fileName: source.fileName,
          fileType: source.fileType,
          fileSize: source.fileSize,
          createdAt: source.createdAt,
          lastModified: source.lastModified,
          dropboxUrl,
          highlights: hit.highlight?.content || [],
        };
      })
    );

    const response = {
      results,
      total: searchResponse.hits.total,
      page: query.page,
      totalPages: Math.ceil(
        (searchResponse.hits.total as any).value / 10
      ),
    };

    cache.set(cacheKey, response);
    res.json(response);
  } catch (error) {
    console.error('Search error:', error);
    res.status(400).json({ error: 'Invalid search parameters' });
  }
});

export default router;