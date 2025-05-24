"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from 'next/navigation';
import { MovieGrid } from "@/components/movie-grid"
import { SearchHeader } from "@/components/search-header"
import { searchMovies, getSearchSummary } from "@/lib/search"; // Import getSearchSummary
import type { Movie } from "@/lib/types";
import { LoadingAnimation } from "@/components/loading-animation"; // Import LoadingAnimation
import ReactMarkdown from 'react-markdown'; // Import ReactMarkdown
import remarkGfm from 'remark-gfm'; // Import remark-gfm for GitHub Flavored Markdown support

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
  const [expanded, setExpanded] = useState(false) // For accordion summary

  useEffect(() => {
    // Function to generate a unique key for session storage
    const getCacheKey = () => {
      // Ensure genres are sorted for consistent key generation if their order in URL can vary
      const sortedGenres = genresParam ? genresParam.split(",").sort().join(",") : "";
      return `searchCache-${query}-${size}-${yearMin}-${yearMax}-${ratingMin}-${sortedGenres}`;
    };

    async function fetchMoviesAndSummary() {
      if (!query) {
        setMovies([]);
        setSummary("");
        setLoading(false);
        setSummaryLoading(false);
        setExpanded(false); // Reset expanded state when query is empty
        return;
      }

      const cacheKey = getCacheKey();
      try {
        const cachedItem = sessionStorage.getItem(cacheKey);
        if (cachedItem) {
          const { cachedMovies, cachedSummary } = JSON.parse(cachedItem);
          setMovies(cachedMovies);
          setSummary(cachedSummary);
          setLoading(false);
          setSummaryLoading(false);
          // console.log("Loaded from cache for key:", cacheKey); // Optional: for debugging
          return;
        }
      } catch (error) {
        console.error("Error reading from session storage:", error);
        // Proceed to fetch if cache is invalid or error occurs
      }
      
      // console.log("Not found in cache or cache error, fetching for key:", cacheKey); // Optional: for debugging

      setLoading(true);
      setSummaryLoading(true); // Start loading summary indication early
      setSummary(""); // Reset summary
      setExpanded(false); // Reset expanded state for new query

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

      let finalSummary;
      if (fetchedMovies.length > 0) {
        // Now fetch summary, summaryLoading is already true
        let fetchedSummary = await getSearchSummary(fetchedMovies, query);
        // Remove potential markdown code block fences and trim whitespace
        // Fix: properly remove markdown code fences with proper regex handling for newlines
        fetchedSummary = fetchedSummary
          .replace(/^```(markdown)?\s*\n?/, '')  // Remove opening fence with or without 'markdown' specifier
          .replace(/\n?```\s*$/, '')             // Remove closing fence
          .trim();                               // Trim whitespace
        setSummary(fetchedSummary);
        finalSummary = fetchedSummary;
      } else {
        const noMoviesSummary = "Tidak ada film yang ditemukan untuk diringkas.";
        setSummary(noMoviesSummary);
        finalSummary = noMoviesSummary;
      }
      setSummaryLoading(false); // Summary is loaded or failed

      // Store in session storage
      try {
        sessionStorage.setItem(cacheKey, JSON.stringify({ cachedMovies: fetchedMovies, cachedSummary: finalSummary }));
      } catch (error) {
        console.error("Error writing to session storage:", error);
      }
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
                <div>
                  <div 
                    className={`prose prose-sm prose-invert max-w-none transition-all duration-500 ease-in-out ${!expanded ? "max-h-[200px] overflow-hidden relative" : "max-h-[2000px]"}`}
                  > 
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        // Custom components for better styling
                        h1: ({ node, ...props }) => <h1 className="text-2xl font-bold my-2" {...props} />,
                        h2: ({ node, ...props }) => <h2 className="text-xl font-bold my-2" {...props} />,
                        h3: ({ node, ...props }) => <h3 className="text-lg font-bold my-1" {...props} />,
                        ul: ({ node, ...props }) => <ul className="list-disc ml-6 mb-4" {...props} />,
                        ol: ({ node, ...props }) => <ol className="list-decimal ml-6 mb-4" {...props} />,
                        li: ({ node, ...props }) => <li className="my-1" {...props} />,
                        p: ({ node, ...props }) => <p className="mb-2" {...props} />
                      }}
                    >
                      {summary || (movies.length > 0 ? "Ringkasan tidak tersedia." : "Masukkan query untuk melihat ringkasan.")}
                    </ReactMarkdown>
                    {!expanded && summary && summary.length > 150 && (
                      <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-slate-800 to-transparent"></div>
                    )}
                  </div>
                  
                  {summary && summary.length > 150 && (
                    <button 
                      onClick={() => setExpanded(!expanded)} 
                      className="mt-2 text-rose-400 hover:text-rose-300 text-sm font-medium flex items-center transition-colors"
                      aria-expanded={expanded}
                    >
                      {expanded ? (
                        <>
                          <span>Sembunyikan</span>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                          </svg>
                        </>
                      ) : (
                        <>
                          <span>Tampilkan lebih banyak</span>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </>
                      )}
                    </button>
                  )}
                </div>
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
