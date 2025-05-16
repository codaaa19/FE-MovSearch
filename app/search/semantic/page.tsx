import { MovieGrid } from "@/components/movie-grid"
import { SearchHeader } from "@/components/search-header"
import { searchMovies } from "@/lib/search"

export default async function SemanticSearchPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const queryParam = (searchParams.q as string) || "{}"
  let parsedQuery

  try {
    parsedQuery = JSON.parse(decodeURIComponent(queryParam))
  } catch (e) {
    parsedQuery = { query: "" }
  }

  const { query, filters, size = 10 } = parsedQuery

  const movies = await searchMovies({
    query,
    size,
    filters,
    type: "semantic",
  })

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <SearchHeader query={query} resultCount={movies.length} isSemanticSearch />
      <main className="container mx-auto px-4 py-8">
        <MovieGrid movies={movies} />
      </main>
    </div>
  )
}
