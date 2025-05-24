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
      
      // Create a compact but unique key
      // For long queries, create a deterministic representation to avoid excessively long keys
      const queryPart = query.length > 50 ? 
        `q-${query.substring(0, 20)}${query.length}${query.substring(query.length - 10)}` : 
        `q-${query}`;
      
      // Include all filter parameters with consistent formatting
      return `keyword-cache-${queryPart}-s${size}-y${yearMin || 0}-${yearMax || 0}-r${ratingMin || 0}-g${sortedGenres}`;
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
      let shouldFetchFresh = true;
      
      try {
        if (typeof window !== 'undefined' && window.sessionStorage) {
          const cachedItem = sessionStorage.getItem(cacheKey);
          if (cachedItem) {
            // Add a try/catch block specifically for JSON parsing
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
                console.log(`Keyword cache age: ${Math.round(cacheAge / 1000)}s / ${Math.round(ONE_HOUR / 1000)}s max`);
              }
              
              if (isValid) {
                setMovies(cachedMovies);
                setSummary(cachedSummary);
                setLoading(false);
                setSummaryLoading(false);
                setExpanded(false); // Reset expanded state to ensure consistent UI
                console.log(`Cache hit: ${cacheKey}, age: ${Math.round(cacheAge / 1000)}s`);
                shouldFetchFresh = false;  // Skip fetch as we have valid cache
                return;
              } else {
                console.log("Cache expired or invalid, fetching fresh data");
                // Remove expired cache
                try {
                  sessionStorage.removeItem(cacheKey);
                } catch (removeError) {
                  console.error("Failed to remove invalid cache entry:", removeError);
                }
              }
            } catch (parseError) {
              console.error("Error parsing cached data:", parseError);
              // Clear invalid cache entry
              try {
                sessionStorage.removeItem(cacheKey);
              } catch (removeError) {
                console.error("Failed to remove invalid cache entry:", removeError);
              }
            }
          } else {
            console.log(`No cache found for key: ${cacheKey}`);
          }
        }
      } catch (error) {
        console.error("Error accessing session storage:", error);
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

      // Movies are already loaded, set loading to false immediately to allow navigation
      setLoading(false); // Movies are loaded immediately - IMPORTANT for navigation

      // Initialize summary value for cache (we'll update it later asynchronously)
      let finalSummary = "Memuat ringkasan...";
      
      // Function to process the summary without blocking navigation
      const processSummary = async () => {
        if (fetchedMovies.length > 0) {
          try {
            // Set an initial message while waiting for the summary
            setSummary("Ringkasan sedang dihasilkan...");
            
            let fetchedSummary = await getSearchSummary(fetchedMovies, query);
            
            // Clean up the summary from markdown artifacts and code blocks
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
                  .replace(/```(?:markdown|md)?\s*\n?/gi, '')  // Remove all opening fences
                  .replace(/\n?\s*```\s*/gi, '')               // Remove all closing fences
                  .trim();                                     // Trim whitespace
              }
                
              // Additional cleanup for better markdown rendering
              fetchedSummary = fetchedSummary
                // Remove any potential harmful tags
                .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')  // Remove script tags
                .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')     // Remove style tags
                // Fix escaped characters that might break tables or other markdown elements
                .replace(/\\[trn]/g, ' ')                                           // Clean escaped characters
                .replace(/\\\\/g, '\\')                                            // Fix double backslashes
                // Ensure tables have proper spacing for better rendering
                .replace(/\|\s*\n/g, '|\n')
                .replace(/\|\s*-\s*\|/g, '| - |');
            }
            
            setSummary(fetchedSummary);
            finalSummary = fetchedSummary;
          } catch (error) {
            console.error("Error fetching or processing summary:", error);
            const errorMessage = "Maaf, terjadi kesalahan saat membuat ringkasan.";
            setSummary(errorMessage);
            finalSummary = errorMessage;
          }
        } else {
          const noMoviesSummary = "Tidak ada film yang ditemukan untuk diringkas.";
          setSummary(noMoviesSummary);
          finalSummary = noMoviesSummary;
        }
        setSummaryLoading(false); // Summary is loaded or failed
        
        // Now that we have the final summary, store it in the cache
        try {
          if (typeof window !== 'undefined' && window.sessionStorage) {
            // Check if the data is too large (over 4MB to be safe)
            const MAX_STORAGE_SIZE = 4 * 1024 * 1024; // 4MB in bytes
            const dataToStore = { 
              cachedMovies: fetchedMovies, 
              cachedSummary: finalSummary,
              timestamp: new Date().getTime() 
            };
            
            const serialized = JSON.stringify(dataToStore);
            
            if (serialized.length > MAX_STORAGE_SIZE) { 
              // If data is too large, store only essential data
              console.warn(`Cache data too large (${Math.round(serialized.length / 1024)}KB), storing reduced version`);
              const reducedMovies = fetchedMovies.map(movie => ({
                id: movie.id,
                title: movie.title,
                release_date: movie.release_date,
                poster_path: movie.poster_path,
                vote_average: movie.vote_average,
                genres: movie.genres,
              }));
              
              const reducedData = { 
                cachedMovies: reducedMovies, 
                cachedSummary: finalSummary,
                timestamp: new Date().getTime(), // Add timestamp for cache validity checks
                isReduced: true
              };
              
              const reducedSerialized = JSON.stringify(reducedData);
              
              // Check if even the reduced version is too large
              if (reducedSerialized.length <= MAX_STORAGE_SIZE) {
                sessionStorage.setItem(cacheKey, reducedSerialized);
                console.log(`Cache stored (reduced): ${cacheKey}, size: ${Math.round(reducedSerialized.length / 1024)}KB`);
              } else {
                console.error("Even reduced cache is too large for sessionStorage");
              }
            } else {
              // Store the full data if it's within size limits
              sessionStorage.setItem(cacheKey, serialized);
              console.log(`Cache stored (full): ${cacheKey}, size: ${Math.round(serialized.length / 1024)}KB`);
            }
          }
        } catch (error) {
          console.error("Error writing to session storage:", error);
        }
      };
      
      // Start the summary processing asynchronously - doesn't block navigation
      processSummary();
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
                  <p className="text-slate-300 text-lg animate-pulse">Membuat ringkasan AI...</p>
                  <div className="w-6 h-6 border-2 border-rose-400 border-t-transparent rounded-full animate-spin mt-3"></div>
                </div>
              ) : (
                <div>
                  {/* Fix for the content visibility with improved transition and increased max height */}
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
