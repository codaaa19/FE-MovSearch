"use client";

import { MovieGrid } from "@/components/movie-grid"
import { SearchHeader } from "@/components/search-header"
import { searchMovies, getSearchSummary } from "@/lib/search"
import type { Movie } from "@/lib/types"
import { LoadingAnimation } from "@/components/loading-animation"
import { useSearchParams } from 'next/navigation'; // Import useSearchParams
import { useEffect, useState } from "react"

export default function SemanticSearchPage() {
  const searchParams = useSearchParams()
  const queryParams = searchParams.get("q")

  let parsedParams: { query: string; filters?: any; size?: number } = { query: "" }
  if (queryParams) {
    try {
      parsedParams = JSON.parse(decodeURIComponent(queryParams))
    } catch (error) {
      console.error("Failed to parse search parameters:", error)
      // Handle error, maybe redirect or show a message
    }
  }

  const { query, filters, size } = parsedParams

  const [showScore, setShowScore] = useState(true) // Default to true for semantic
  const [movies, setMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true) // For movies list
  const [summary, setSummary] = useState<string>("")
  const [summaryLoading, setSummaryLoading] = useState(false) // For AI summary

  useEffect(() => {
    async function fetchMoviesAndSummary() {
      if (!query) {
        setMovies([])
        setSummary("")
        setLoading(false)
        setSummaryLoading(false)
        return
      }

      setLoading(true)
      setSummaryLoading(true) // Start loading summary indication early
      setSummary("") // Reset summary

      const fetchedMovies = await searchMovies({
        query,
        size: size || 10,
        filters,
        type: "semantic", // This page is for semantic search
      })
      setMovies(fetchedMovies)
      setLoading(false) // Movies are loaded

      if (fetchedMovies.length > 0) {
        // Now fetch summary, summaryLoading is already true
        const fetchedSummary = await getSearchSummary(fetchedMovies, query)
        setSummary(fetchedSummary)
      } else {
        setSummary("Tidak ada film yang ditemukan untuk diringkas.")
      }
      setSummaryLoading(false) // Summary is loaded or failed
    }

    if (query) {
      fetchMoviesAndSummary()
    } else {
      setLoading(false)
      setSummaryLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, JSON.stringify(filters), size]) // stringify filters for dependency array

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <SearchHeader
        query={query}
        resultCount={movies.length}
        showScore={showScore}
        onShowScoreChange={setShowScore}
        // isSemanticPage={true} // Removed as it's not a prop of SearchHeader
      />
      <main className="container mx-auto px-4 py-8">
        {loading ? (
          <LoadingAnimation />
        ) : (
          <>
            <div className="mb-8 p-4 bg-slate-800 rounded-lg">
              <h2 className="text-xl font-semibold mb-2 text-slate-100">Ringkasan AI</h2>
              {summaryLoading ? (
                <div className="flex flex-col items-center justify-center py-6">
                  <p className="text-slate-300 text-lg animate-pulse">Membuat ringkasan AI...</p>
                </div>
              ) : (
                <p className="text-slate-300 whitespace-pre-wrap">
                  {summary || (movies.length > 0 ? "Ringkasan tidak tersedia." : "Masukkan query untuk melihat ringkasan.")}
                </p>
              )}
            </div>

            {movies.length > 0 ? (
              <MovieGrid movies={movies} showScore={showScore} />
            ) : (
              query && !loading && <p className="text-center text-slate-400 text-lg">Tidak ada film yang cocok dengan pencarian Anda.</p>
            )}
            {!query && !loading && (
              <p className="text-center text-slate-400 text-lg">Silakan masukkan kata kunci untuk memulai pencarian film.</p>
            )}
          </>
        )}
      </main>
    </div>
  )
}
