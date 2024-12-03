import axios from 'axios';
import { SearchFilters, SearchResponse } from '../types/search';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export const searchDocuments = async (
  query: string,
  filters: SearchFilters,
  page = 1
): Promise<SearchResponse> => {
  const { data } = await api.get('/search', {
    params: {
      q: query,
      page,
      ...filters,
    },
  });
  return data;
};