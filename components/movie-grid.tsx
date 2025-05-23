import type { Movie } from "@/lib/types"
import { MovieCard } from "@/components/movie-card"

interface MovieGridProps {
  movies: Movie[]
  showScore?: boolean
}

export function MovieGrid({ movies, showScore }: MovieGridProps) {
  if (movies.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <h2 className="text-2xl font-semibold text-slate-300">No movies found</h2>
        <p className="text-slate-400 mt-2">Try adjusting your search or filters</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} showScore={showScore} />
      ))}
    </div>
  )
}
