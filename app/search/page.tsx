"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from 'next/navigation';
import { MovieGrid } from "@/components/movie-grid"
import { SearchHeader } from "@/components/search-header"
import { searchMovies, getSearchSummary } from "@/lib/search"; // Import getSearchSummary
import type { Movie } from "@/lib/types";
import { LoadingAnimation } from "@/components/loading-animation"; // Import LoadingAnimation

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";
  const size = Number.parseInt(searchParams.get("size") || "10");
  
  // Correctly parse optional numeric parameters, defaulting to 0 or undefined if not present/invalid
  const yearMinParam = searchParams.get("year_min");
  const yearMaxParam = searchParams.get("year_max");
  const ratingMinParam = searchParams.get("rating_min");
  
  const yearMin = yearMinParam ? Number.parseInt(yearMinParam) : 0;
  const yearMax = yearMaxParam ? Number.parseInt(yearMaxParam) : 0;
  const ratingMin = ratingMinParam ? Number.parseFloat(ratingMinParam) : 0;

  const genresParam = searchParams.get("genres");
  const genres = genresParam ? genresParam.split(",") : []
  
  const [showScore, setShowScore] = useState(false)
  const [movies, setMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true) // For movies list
  const [summary, setSummary] = useState<string>("")
  const [summaryLoading, setSummaryLoading] = useState(false) // For AI summary

  useEffect(() => {
    async function fetchMoviesAndSummary() {
      if (!query) {
        setMovies([]);
        setSummary("");
        setLoading(false);
        setSummaryLoading(false);
        return;
      }

      setLoading(true);
      setSummaryLoading(true); // Start loading summary indication early
      setSummary(""); // Reset summary

      const fetchedMovies = await searchMovies({
        query,
        size,
        filters: {
          year: { 
            min: yearMin > 0 ? yearMin : undefined, 
            max: yearMax > 0 ? yearMax : undefined 
          },
          // Ensure ratingMin is passed correctly, allowing 0
          rating: { min: ratingMin >= 0 ? ratingMin : undefined }, 
          genres: genres.length > 0 ? genres : undefined,
        },
        type: "keyword", // This page is for keyword search
      });
      setMovies(fetchedMovies);
      setLoading(false); // Movies are loaded

      if (fetchedMovies.length > 0) {
        // Now fetch summary, summaryLoading is already true
        const fetchedSummary = await getSearchSummary(fetchedMovies, query);
        setSummary(fetchedSummary);
      } else {
        setSummary("Tidak ada film yang ditemukan untuk diringkas.");
      }
      setSummaryLoading(false); // Summary is loaded or failed
    }
    
    fetchMoviesAndSummary();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, size, yearMin, yearMax, ratingMin, genresParam]);

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <SearchHeader
        query={query}
        resultCount={movies.length}
        showScore={showScore}
        onShowScoreChange={setShowScore}
      />
      <main className="container mx-auto px-4 py-8">
        {/* Main loading for movie results */}
        {loading ? (
          <LoadingAnimation />
        ) : (
          <>
            <div className="mb-8 p-4 bg-slate-800 rounded-lg">
              <h2 className="text-xl font-semibold mb-2 text-slate-100">Ringkasan AI</h2>
              {/* Loading state for summary specifically */}
              {summaryLoading ? (
                <div className="flex flex-col items-center justify-center py-6">
                  {/* You can use a smaller, inline loading indicator or a simplified version of LoadingAnimation here */}
                  <p className="text-slate-300 text-lg animate-pulse">Membuat ringkasan AI...</p>
                  {/* Optionally, a smaller spinner:
                  <div className="w-6 h-6 border-2 border-rose-400 border-t-transparent rounded-full animate-spin"></div> 
                  */}
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
                 // Show message if query exists but no movies found, and not in initial loading state
                 query && !loading && <p className="text-center text-slate-400 text-lg">Tidak ada film yang cocok dengan pencarian Anda.</p>
            )}
            {/* Show message if no query and not loading (initial state or after clearing query) */}
            {!query && !loading && (
              <p className="text-center text-slate-400 text-lg">Silakan masukkan kata kunci untuk memulai pencarian film.</p>
            )}
          </>
        )}
      </main>
    </div>
  )
}
