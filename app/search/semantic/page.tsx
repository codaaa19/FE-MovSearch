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
    // Create a consistent representation of filters regardless of property order
    const filtersStr = filters ? JSON.stringify(
      Object.fromEntries(
        Object.entries(filters).sort(([a], [b]) => a.localeCompare(b))
      )
    ) : "";

    // Create a deterministic hash for long queries to prevent excessively long keys
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
      let shouldFetchFresh = true;
      
      try {
        if (typeof window !== 'undefined' && window.sessionStorage) {
          const cachedItem = sessionStorage.getItem(cacheKey);
          if (cachedItem) {
            try {
              const cachedData = JSON.parse(cachedItem);
              
              // Validate the structure of cached data
              if (!cachedData || typeof cachedData !== 'object') {
                throw new Error("Invalid cache format");
              }
              
              const { cachedMovies, cachedSummary, timestamp } = cachedData;
              
              // Check if cache is still valid (less than 1 hour old)
              const ONE_HOUR = 60 * 60 * 1000; // 1 hour in milliseconds
              const now = new Date().getTime();
              const cacheAge = timestamp ? now - timestamp : Infinity;
              
              const isValid = 
                Array.isArray(cachedMovies) && 
                cachedMovies.length > 0 && 
                typeof cachedSummary === 'string' &&
                cacheAge < ONE_HOUR;
                
              if (timestamp) {
                console.log(`Semantic cache age: ${Math.round(cacheAge / 1000)}s / ${Math.round(ONE_HOUR / 1000)}s max`);
              }
              
              if (isValid) {
                setMovies(cachedMovies);
                setSummary(cachedSummary);
                setLoading(false);
                setSummaryLoading(false);
                setExpanded(false); // Reset expanded state to ensure consistent UI
                console.log(`Cache hit for semantic search: ${cacheKey}`);
                shouldFetchFresh = false;  // Skip fetch as we have valid cache
                return;
              } else {
                console.log("Cache expired or invalid, fetching fresh data for semantic search");
                sessionStorage.removeItem(cacheKey);
              }
            } catch (parseError) {
              console.error("Error parsing cached data for semantic search:", parseError);
              // Clean up invalid cache entry
              try {
                sessionStorage.removeItem(cacheKey);
              } catch (removeError) {
                console.error("Failed to remove invalid cache entry:", removeError);
              }
            }
          } else {
            console.log(`No cache found for semantic search: ${cacheKey}`);
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
      
      // Set movies and immediately stop loading to prevent navigation delay
      // This allows users to interact with movie results and navigate to detail pages
      // even while the summary is still being generated
      setMovies(fetchedMovies)
      setLoading(false) // Movies are loaded - IMPORTANT: This enables immediate navigation
      
      // Initialize with a temporary message
      let finalSummary = "Memuat ringkasan...";
      
      // Create a true asynchronous function for handling summary
      const generateSummaryAsync = async () => {
        if (fetchedMovies.length > 0) {
          try {
            // Set an initial message while waiting for the summary
            setSummary("Ringkasan sedang dihasilkan...");
            
            // Now fetch summary asynchronously
            let fetchedSummary = await getSearchSummary(fetchedMovies, query);
            
            // Clean up the summary from markdown artifacts
            if (fetchedSummary) {
              // First, try to extract content from markdown code blocks with improved regex
              // that handles nested code blocks better
              const codeBlockRegex = /```(?:markdown|md)?\s*\n?([\s\S]*?)\n?\s*```(?!\w)/gi;
              let extractedContent = '';
              let match;
              
              // Find all code blocks and concatenate their contents
              while ((match = codeBlockRegex.exec(fetchedSummary)) !== null) {
                if (match[1] && match[1].trim()) {
                  extractedContent += match[1].trim() + '\n\n';
                }
              }
              
              // If we found content inside code blocks, use that
              if (extractedContent) {
                fetchedSummary = extractedContent.trim();
              } else {
                // If no content was extracted from code blocks, just clean up all code block markers
                fetchedSummary = fetchedSummary
                  .replace(/```(?:markdown|md)?\s*\n?/gi, '')
                  .replace(/\n?\s*```\s*/gi, '')
                  .trim();
              }
              
              // Additional cleanup for better markdown rendering
              fetchedSummary = fetchedSummary
                // Remove any potential harmful tags
                .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
                .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
                // Fix escaped characters that might break tables or other markdown elements
                .replace(/\\[trn]/g, ' ')  
                .replace(/\\\\/g, '\\')
                // Ensure tables have proper spacing
                .replace(/\|\s*\n/g, '|\n')
                .replace(/\|\s*-\s*\|/g, '| - |');
            }
            
            // Update the state with summary results
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
        
        // Mark loading as complete
        setSummaryLoading(false);
        
        // Then update the cache with the final data
        try {
          if (typeof window !== 'undefined' && window.sessionStorage) {
            const dataToStore = { 
              cachedMovies: fetchedMovies, 
              cachedSummary: finalSummary,
              timestamp: new Date().getTime()
            };
            const serialized = JSON.stringify(dataToStore);
            
            // Check if data is too large for sessionStorage (typically limited to ~5MB)
            // We use a 4MB limit to be safe
            const MAX_STORAGE_SIZE = 4 * 1024 * 1024; // 4MB in bytes
            
            if (serialized.length > MAX_STORAGE_SIZE) { 
              console.warn(`Cache data too large (${Math.round(serialized.length / 1024)}KB), storing reduced version`);
              // If data is too large, store reduced version with essential data only
              const reducedMovies = fetchedMovies.map(movie => ({
                id: movie.id,
                title: movie.title,
                release_date: movie.release_date,
                poster_path: movie.poster_path,
                vote_average: movie.vote_average,
                genres: movie.genres,
                score: movie.score
              }));
              
              const reducedData = {
                cachedMovies: reducedMovies, 
                cachedSummary: finalSummary,
                timestamp: new Date().getTime(),
                isReduced: true
              };
              
              const reducedSerialized = JSON.stringify(reducedData);
              
              // Check if even the reduced version is too large
              if (reducedSerialized.length <= MAX_STORAGE_SIZE) {
                sessionStorage.setItem(cacheKey, reducedSerialized);
                console.log(`Stored reduced cache for semantic search: ${cacheKey} (${Math.round(reducedSerialized.length / 1024)}KB)`);
              } else {
                console.error("Even reduced cache is too large for sessionStorage");
              }
            } else {
              sessionStorage.setItem(cacheKey, serialized);
              console.log(`Stored full cache for semantic search: ${cacheKey} (${Math.round(serialized.length / 1024)}KB)`);
            }
          }
        } catch (error) {
          console.error("Error writing to session storage for semantic search:", error);
        }
      };
      
      // Launch the summary generation as a non-blocking operation
      generateSummaryAsync().catch(error => {
        console.error("Unhandled error in summary generation:", error);
        setSummaryLoading(false);
      });

      // This code is removed as we're now correctly handling cache updates
      // in the generateSummaryAsync() function above
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
        isSemanticSearch={true} // Add this prop to indicate semantic search
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
                        // Headers styling
                        h1: ({ node, ...props }) => <h1 className="text-2xl font-bold my-3 text-white" {...props} />,
                        h2: ({ node, ...props }) => <h2 className="text-xl font-bold my-2 text-white" {...props} />,
                        h3: ({ node, ...props }) => <h3 className="text-lg font-bold my-2 text-white" {...props} />,
                        h4: ({ node, ...props }) => <h4 className="text-base font-bold my-1 text-white" {...props} />,
                        
                        // List styling
                        ul: ({ node, ...props }) => <ul className="list-disc ml-6 mb-4 pl-2 space-y-1" {...props} />,
                        ol: ({ node, ...props }) => <ol className="list-decimal ml-6 mb-4 pl-2 space-y-1" {...props} />,
                        li: ({ node, ...props }) => <li className="my-0.5 text-slate-200" {...props} />,
                        
                        // Paragraph styling
                        p: ({ node, ...props }) => <p className="mb-3 text-slate-200" {...props} />,
                        
                        // Enhanced table styling with border and spacing improvements
                        table: ({ node, ...props }) => <div className="overflow-x-auto my-4"><table className="w-full border-collapse border border-slate-600 rounded" {...props} /></div>,
                        thead: ({ node, ...props }) => <thead className="bg-slate-700 text-white" {...props} />,
                        tbody: ({ node, ...props }) => <tbody className="divide-y divide-slate-600 bg-slate-800/50" {...props} />,
                        tr: ({ node, ...props }) => <tr className="hover:bg-slate-700/60 transition-colors" {...props} />,
                        th: ({ node, ...props }) => <th className="p-2 text-left font-semibold border-b border-slate-600" {...props} />,
                        td: ({ node, ...props }) => <td className="p-2 border-r border-slate-700 last:border-r-0" {...props} />,
                        
                        // Code styling
                        pre: ({ node, ...props }) => <pre className="bg-slate-800 p-3 rounded my-3 overflow-x-auto border border-slate-700" {...props} />,
                        code: ({ node, inline, className, children, ...props }: any) => {
                          const match = /language-(\w+)/.exec(className || '');
                          return inline ? (
                            <code 
                              className="bg-slate-800 px-1.5 py-0.5 rounded text-rose-300 text-sm"
                              {...props}
                            >
                              {children}
                            </code>
                          ) : (
                            <code 
                              className={match ? `block bg-slate-800 px-3 py-2 rounded language-${match[1]}` : `block bg-slate-800 px-3 py-2 rounded`}
                              {...props}
                            >
                              {children}
                            </code>
                          );
                        },
                        
                        // Additional element styling
                        blockquote: ({ node, ...props }) => <blockquote className="border-l-4 border-rose-400 pl-4 italic my-3 text-slate-300" {...props} />,
                        hr: ({ node, ...props }) => <hr className="border-t border-slate-600 my-4" {...props} />,
                        a: ({ node, ...props }) => <a className="text-rose-400 hover:text-rose-300 underline transition-colors" {...props} />,
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
