export interface Movie {
  id: string
  title: string
  overview: string
  release_date?: string
  vote_average?: number
  popularity?: number
  genres?: string[] | string
  director?: string
  cast?: string[] | string
  poster_path?: string
  tagline?: string
  runtime?: number
  imdb_rating?: number
  score?: number
}

export interface SearchFilters {
  genres?: string[]
  year?: {
    min?: number
    max?: number
  }
  rating?: {
    min?: number
  }
}

export interface SearchParams {
  query: string
  size?: number
  filters?: SearchFilters
  type: "keyword" | "semantic"
}
