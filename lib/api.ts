import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export interface Movie {
  id: string;
  title: string;
  overview: string;
  release_date: string;
  vote_average: number;
  genres: string[];
  poster_path: string;
}

export interface SearchFilters {
  year?: {
    min?: number;
    max?: number;
  };
  vote_average?: {
    min: number;
  };
  genres?: string[];
}

export interface SearchRequest {
  query: string;
  size?: number;
  min_score?: number;
  filters?: SearchFilters;
}

export interface HybridSearchRequest extends SearchRequest {
  weights?: {
    bm25?: number;
    vector?: number;
  };
}

const api = {
  // Hybrid search combining semantic and keyword search
  async hybridSearch(params: HybridSearchRequest): Promise<Movie[]> {
    const response = await axios.post(`${API_BASE_URL}/movies/hybrid-search`, params);
    return response.data;
  },

  // Semantic search
  async semanticSearch(params: SearchRequest): Promise<Movie[]> {
    const response = await axios.post(`${API_BASE_URL}/movies/hybrid-search`, params);
    return response.data;
  },

  // Keyword search
  async keywordSearch(
    query: string,
    size: number = 10,
    yearMin?: number,
    yearMax?: number,
    ratingMin?: number,
    genres?: string[]
  ): Promise<Movie[]> {
    const params = new URLSearchParams({
      query,
      size: size.toString(),
      ...(yearMin && { year_min: yearMin.toString() }),
      ...(yearMax && { year_max: yearMax.toString() }),
      ...(ratingMin && { rating_min: ratingMin.toString() }),
      ...(genres && { genres: genres.join(',') }),
    });

    const response = await axios.get(`${API_BASE_URL}/movies/search?${params}`);
    return response.data;
  },

  // Get movie by ID
  async getMovie(id: string): Promise<Movie> {
    const response = await axios.get(`${API_BASE_URL}/movies/${id}`);
    return response.data;
  },
};

export default api; 