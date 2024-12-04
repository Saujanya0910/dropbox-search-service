import { Request, Response } from 'express';
import { searchDocuments } from '../services/elasticsearch';
import { getDropboxUrl } from '../services/dropbox';
import { cacheService } from '../services/cache';
import { SearchQuerySchema } from '../schemas/search.schema';
import { CACHE_KEYS } from '../constants';

export class SearchController {
  /**
   * Handler for main /search endpoint
   * @param req 
   * @param res 
   */
  static async search(req: Request, res: Response) {
    try {
      const query = SearchQuerySchema.parse(req.query);
      const cacheKey = CACHE_KEYS.SEARCH(JSON.stringify(query));
      
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
  
      return res.json(response);
    } catch (error) {
      console.error('[SEARCH CONTROLLER] [search] Search error:', error);
      return res.status(400).json({ 
        error: 'Invalid search parameters',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}