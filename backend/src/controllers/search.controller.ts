import { Request, Response } from 'express';
import { searchDocuments } from '../services/elasticsearch';
import { getDropboxUrl } from '../services/dropbox';
import { cacheService } from '../services/cache';
import { SearchQuerySchema } from '../schemas/search.schema';

export class SearchController {
  static async search(req: Request, res: Response) {
    try {
      const query = SearchQuerySchema.parse(req.query);
      const cacheKey = `search:${JSON.stringify(query)}`;
      
      const cachedResult = cacheService.get(cacheKey);
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

      cacheService.set(cacheKey, response);
      res.json(response);
    } catch (error) {
      res.status(400).json({ 
        error: 'Invalid search parameters',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}