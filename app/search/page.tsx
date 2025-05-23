"use client"

import { useState, useEffect } from "react"
import { MovieGrid } from "@/components/movie-grid"
import { SearchHeader } from "@/components/search-header"
import { searchMovies } from "@/lib/search"
import type { Movie } from "@/lib/types"

export default function SearchPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const query = (searchParams.query as string) || ""
  const size = Number.parseInt((searchParams.size as string) || "10")
  const yearMin = Number.parseInt((searchParams.year_min as string) || "0")
  const yearMax = Number.parseInt((searchParams.year_max as string) || "0")
  const ratingMin = Number.parseFloat((searchParams.rating_min as string) || "0")
  const genres = searchParams.genres ? (searchParams.genres as string).split(",") : []
  const [showScore, setShowScore] = useState(false)
  const [movies, setMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchInitialMovies() {
      setLoading(true)
      const fetchedMovies = await searchMovies({
        query,
        size,
        filters: {
          year: { min: yearMin || undefined, max: yearMax || undefined },
          rating: { min: ratingMin || undefined },
          genres: genres.length > 0 ? genres : undefined,
        },
        type: "keyword",
      })
      setMovies(fetchedMovies)
      setLoading(false)
    }
    fetchInitialMovies()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, size, yearMin, yearMax, ratingMin, searchParams.genres])

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <SearchHeader
        query={query}
        resultCount={movies.length}
        showScore={showScore}
        onShowScoreChange={setShowScore}
      />
      <main className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-xl text-slate-300">Loading movies...</p>
          </div>
        ) : (
          <MovieGrid movies={movies} showScore={showScore} />
        )}
      </main>
    </div>
  )
}
