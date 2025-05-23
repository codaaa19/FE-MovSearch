import axios from 'axios';
import type { Movie } from './types'; // Assuming this is your frontend Movie type

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Interfaces for backend request/response structures

export interface BackendSearchFilters { // For semantic search filters
  year?: {
    min?: number;
    max?: number;
  };
  vote_average?: { // Corresponds to 'rating' in frontend filters for semantic search
    min?: number;
  };
  genres?: string[];
}

export interface BackendQueryRequest { // For semantic search and hybrid search
  query: string;
  size?: number;
  min_score?: number; // For semantic search
  filters?: BackendSearchFilters;
  weights?: { // For hybrid search
    bm25?: number;
    vector?: number;
  };
}

export interface BackendKeywordSearchRequest { // For keyword search
  query: string;
  size?: number;
  year_min?: number;
  year_max?: number;
  rating_min?: number; // Backend expects float for rating_min
  genres?: string; // Comma-separated string
}

export interface MovieSummaryRequestData { // Renamed to avoid conflict if Movie is also a class/interface
  movies: Movie[]; // Uses frontend Movie type. Ensure its structure is compatible with backend's MoviePydantic.
  query?: string;
}

export interface MovieSummaryResponseData { // Renamed
  summary: string;
  query?: string;
  movie_count: number;
}

// Define API endpoints based on your backend router structure
// Assuming your FastAPI app includes these routers with a prefix like /api/v1
const MOVIES_API_PREFIX = `${API_BASE_URL}/api/v1/movies`;
const SUMMARY_API_PREFIX = `${API_BASE_URL}/api/v1/search`;

const api = {
  async semanticSearch(params: BackendQueryRequest): Promise<Movie[]> {
    const response = await axios.post(`${MOVIES_API_PREFIX}/semantic-search`, params);
    return response.data;
  },

  async keywordSearch(params: BackendKeywordSearchRequest): Promise<Movie[]> {
    const response = await axios.post(`${MOVIES_API_PREFIX}/keyword-search`, params);
    return response.data;
  },

  async getMovie(id: string): Promise<Movie> {
    const response = await axios.get(`${MOVIES_API_PREFIX}/${id}`);
    return response.data;
  },

  // Example for hybrid search if you plan to use it from frontend:
  // async hybridSearch(params: BackendQueryRequest): Promise<Movie[]> {
  //   const response = await axios.post(`${MOVIES_API_PREFIX}/hybrid-search`, params);
  //   return response.data;
  // },

  async summarizeMovies(requestBody: MovieSummaryRequestData): Promise<string> {
    const response = await axios.post<MovieSummaryResponseData>(`${SUMMARY_API_PREFIX}/summarize`, requestBody);
    return response.data.summary;
  }
};

export default api;