import { MovieGrid } from "@/components/movie-grid"
import { SearchHeader } from "@/components/search-header"
import { searchMovies } from "@/lib/search"

export default async function SearchPage({
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

  const movies = await searchMovies({
    query,
    size,
    filters: {
      year: { min: yearMin || undefined, max: yearMax || undefined },
      rating: { min: ratingMin || undefined },
      genres: genres.length > 0 ? genres : undefined,
    },
    type: "keyword",
  })

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <SearchHeader query={query} resultCount={movies.length} />
      <main className="container mx-auto px-4 py-8">
        <MovieGrid movies={movies} />
      </main>
    </div>
  )
}
