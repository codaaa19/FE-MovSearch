"use client";

import { MovieGrid } from "@/components/movie-grid"
import { SearchHeader } from "@/components/search-header"
import { searchMovies, getSearchSummary } from "@/lib/search"
import type { Movie } from "@/lib/types"
import { LoadingAnimation } from "@/components/loading-animation"
import { useSearchParams } from 'next/navigation'; // Import useSearchParams
import { useEffect, useState } from "react"
import ReactMarkdown from 'react-markdown' // Import ReactMarkdown
import remarkGfm from 'remark-gfm' // Import remark-gfm

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

  // State for accordion expansion
  const [expanded, setExpanded] = useState(false)

  // Function to generate a unique key for session storage
  const getCacheKey = () => {
    const filtersStr = filters ? JSON.stringify(filters) : "";
    const queryPart = query && query.length > 50 ? 
      `q-${query.substring(0, 20)}${query.length}${query.substring(query.length - 10)}` : 
      `q-${query}`;
    
    return `semantic-cache-${queryPart}-s${size || 10}-f${filtersStr}`;
  };

  useEffect(() => {
    async function fetchMoviesAndSummary() {
      if (!query) {
        setMovies([])
        setSummary("")
        setLoading(false)
        setSummaryLoading(false)
        setExpanded(false) // Reset expanded state when query is empty
        return
      }

      // Try to fetch from cache first
      const cacheKey = getCacheKey();
      try {
        if (typeof window !== 'undefined' && window.sessionStorage) {
          const cachedItem = sessionStorage.getItem(cacheKey);
          if (cachedItem) {
            try {
              const cachedData = JSON.parse(cachedItem);
              const { cachedMovies, cachedSummary, timestamp } = cachedData;
              
              // Check if cache is still valid (less than 1 hour old)
              const isValid = 
                Array.isArray(cachedMovies) && 
                cachedMovies.length > 0 && 
                typeof cachedSummary === 'string' &&
                (!timestamp || (new Date().getTime() - timestamp < 60 * 60 * 1000));
              
              if (isValid) {
                setMovies(cachedMovies);
                setSummary(cachedSummary);
                setLoading(false);
                setSummaryLoading(false);
                console.log(`Cache hit for semantic search: ${cacheKey}`);
                return;
              } else {
                console.log("Cache expired, fetching fresh data for semantic search");
                sessionStorage.removeItem(cacheKey);
              }
            } catch (parseError) {
              console.error("Error parsing cached data for semantic search:", parseError);
              sessionStorage.removeItem(cacheKey);
            }
          }
        }
      } catch (error) {
        console.error("Error accessing session storage for semantic search:", error);
      }

      // If no cache hit, proceed with fetching
      setLoading(true)
      setSummaryLoading(true) // Start loading summary indication early
      setSummary("") // Reset summary
      setExpanded(false) // Reset expanded state for new query

      const fetchedMovies = await searchMovies({
        query,
        size: size || 10,
        filters,
        type: "semantic", // This page is for semantic search
      })
      setMovies(fetchedMovies)
      setLoading(false) // Movies are loaded

      // Start a separate task for summary generation to avoid blocking navigation
      let finalSummary = "";
      if (fetchedMovies.length > 0) {
        try {
          // Now fetch summary, summaryLoading is already true
          let fetchedSummary = await getSearchSummary(fetchedMovies, query);
          
          // Clean up the summary from markdown artifacts
          if (fetchedSummary) {
            // Extract content from all markdown code blocks
            const codeBlockRegex = /```(?:markdown)?\s*\n?([\s\S]*?)\n?\s*```/gi;
            const match = codeBlockRegex.exec(fetchedSummary);
            
            if (match && match[1]) {
              fetchedSummary = match[1].trim();
            } else {
              fetchedSummary = fetchedSummary
                .replace(/```(?:markdown)?\s*\n?/gi, '')
                .replace(/\n?\s*```\s*/gi, '')
                .trim();
            }
            
            fetchedSummary = fetchedSummary
              .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
              .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');
          }
          
          setSummary(fetchedSummary);
          finalSummary = fetchedSummary;
        } catch (error) {
          console.error("Error fetching semantic search summary:", error);
          finalSummary = "Maaf, terjadi kesalahan saat membuat ringkasan.";
          setSummary(finalSummary);
        }
      } else {
        finalSummary = "Tidak ada film yang ditemukan untuk diringkas.";
        setSummary(finalSummary);
      }
      setSummaryLoading(false);

      // Store in session storage
      try {
        if (typeof window !== 'undefined' && window.sessionStorage) {
          const dataToStore = { 
            cachedMovies: fetchedMovies, 
            cachedSummary: finalSummary,
            timestamp: new Date().getTime()
          };
          const serialized = JSON.stringify(dataToStore);
          
          if (serialized.length > 4 * 1024 * 1024) { 
            // If data is too large, store reduced version
            const reducedMovies = fetchedMovies.map(movie => ({
              id: movie.id,
              title: movie.title,
              release_date: movie.release_date,
              poster_path: movie.poster_path,
              vote_average: movie.vote_average,
              genres: movie.genres,
              score: movie.score
            }));
            
            sessionStorage.setItem(cacheKey, JSON.stringify({ 
              cachedMovies: reducedMovies, 
              cachedSummary: finalSummary,
              timestamp: new Date().getTime() 
            }));
            console.log(`Stored reduced cache for semantic search: ${cacheKey}`);
          } else {
            sessionStorage.setItem(cacheKey, serialized);
            console.log(`Stored full cache for semantic search: ${cacheKey}`);
          }
        }
      } catch (error) {
        console.error("Error writing to session storage for semantic search:", error);
      }
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
              {/* Loading state for summary specifically */}
              {summaryLoading ? (
                <div className="flex flex-col items-center justify-center py-6">
                  <p className="text-slate-300 text-lg animate-pulse">Membuat ringkasan AI...</p>
                  <div className="w-6 h-6 border-2 border-rose-400 border-t-transparent rounded-full animate-spin mt-3"></div>
                </div>
              ) : (
                <div>
                  {/* Fix for the content visibility with improved transition */}
                  <div 
                    className={`prose prose-sm prose-invert max-w-none transition-all duration-500 ease-in-out ${
                      !expanded ? "max-h-[200px] overflow-hidden relative" : ""
                    }`}
                  > 
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        h1: ({ node, ...props }) => <h1 className="text-2xl font-bold my-2" {...props} />,
                        h2: ({ node, ...props }) => <h2 className="text-xl font-bold my-2" {...props} />,
                        h3: ({ node, ...props }) => <h3 className="text-lg font-bold my-1" {...props} />,
                        ul: ({ node, ...props }) => <ul className="list-disc ml-6 mb-4" {...props} />,
                        ol: ({ node, ...props }) => <ol className="list-decimal ml-6 mb-4" {...props} />,
                        li: ({ node, ...props }) => <li className="my-1" {...props} />,
                        p: ({ node, ...props }) => <p className="mb-2" {...props} />,
                        table: ({ node, ...props }) => <table className="w-full border-collapse my-4" {...props} />,
                        thead: ({ node, ...props }) => <thead className="bg-slate-700" {...props} />,
                        tbody: ({ node, ...props }) => <tbody className="divide-y divide-slate-600" {...props} />,
                        tr: ({ node, ...props }) => <tr className="border-b border-slate-600" {...props} />,
                        th: ({ node, ...props }) => <th className="p-2 text-left font-bold" {...props} />,
                        td: ({ node, ...props }) => <td className="p-2" {...props} />,
                        pre: ({ node, ...props }) => <pre className="bg-slate-700 p-3 rounded my-3 overflow-x-auto" {...props} />,
                        code: ({ node, className, ...props }: any) => {
                          const match = /language-(\w+)/.exec(className || '');
                          return (
                            <code 
                              className={match ? `bg-slate-700 px-1 py-0.5 rounded language-${match[1]}` : `bg-slate-700 px-1 py-0.5 rounded`} 
                              {...props} 
                            />
                          )
                        }
                      }}
                    >
                      {summary || (movies.length > 0 ? "Ringkasan tidak tersedia." : "Masukkan query untuk melihat ringkasan.")}
                    </ReactMarkdown>
                    {/* Only show gradient overlay when not expanded and content is long enough */}
                    {!expanded && summary && summary.length > 150 && (
                      <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-slate-800 to-transparent"></div>
                    )}
                  </div>
                  
                  {/* Only show expand/collapse button when summary is long enough */}
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
