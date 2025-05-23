import Image from "next/image"
import Link from "next/link"; // Pastikan Link diimpor kembali
import { ArrowLeft, Clock, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getMovieById } from "@/lib/search"
import { MovieCast } from "@/components/movie-cast";
import { BackButton } from "@/components/back-button";

export default async function MoviePage({ params }: { params: { id: string } }) {
  const movie = await getMovieById(params.id)

  if (!movie) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white p-4">
        <h1 className="text-3xl font-bold">Movie not found</h1>
        <p className="text-slate-300 mt-2">The movie you're looking for doesn't exist or has been removed.</p>
        <Link href="/" className="mt-6"> {/* Link ini tetap menggunakan / sebagai href */}
          <Button className="bg-rose-500 hover:bg-rose-600">Back to Home</Button>
        </Link>
      </div>
    )
  }

  const genres = typeof movie.genres === "string" ? movie.genres.split(", ") : movie.genres || []

  const cast = movie.cast

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="relative h-[50vh] w-full">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-900 z-10" />
        <Image
          src={movie.poster_path || "/placeholder.svg?height=800&width=600"}
          alt={movie.title}
          fill
          className="object-cover"
          priority
        />
        <BackButton /> {/* Menggunakan komponen BackButton di sini */}
      </div>

      <div className="container mx-auto px-4 py-8 -mt-32 relative z-20">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/3 lg:w-1/4">
            <div className="aspect-[2/3] relative rounded-lg overflow-hidden shadow-xl">
              <Image
                src={movie.poster_path || "/placeholder.svg?height=450&width=300"}
                alt={movie.title}
                fill
                className="object-cover"
              />
            </div>
          </div>

          <div className="w-full md:w-2/3 lg:w-3/4">
            <h1 className="text-3xl md:text-4xl font-bold">{movie.title}</h1>

            {movie.tagline && <p className="text-rose-400 text-lg mt-2 italic">"{movie.tagline}"</p>}

            <div className="flex flex-wrap gap-4 mt-4">
              {movie.release_date && <div className="text-slate-300">{new Date(movie.release_date).getFullYear()}</div>}

              {movie.runtime && (
                <div className="flex items-center gap-1 text-slate-300">
                  <Clock className="h-4 w-4" />
                  {movie.runtime} min
                </div>
              )}

              {(movie.imdb_rating || movie.vote_average) && (
                <div className="flex items-center gap-1 text-yellow-400">
                  <Star className="h-4 w-4 fill-yellow-400" />
                  {movie.imdb_rating || movie.vote_average}
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-2 mt-4">
              {Array.isArray(genres) &&
                genres.map((genre, index) => (
                  <span key={index} className="text-sm bg-slate-700 text-slate-300 px-3 py-1 rounded-full">
                    {genre}
                  </span>
                ))}
            </div>

            <div className="mt-6">
              <h2 className="text-xl font-semibold">Overview</h2>
              <p className="text-slate-300 mt-2 leading-relaxed">{movie.overview}</p>
            </div>

            {movie.director && (
              <div className="mt-6">
                <h2 className="text-xl font-semibold">Director</h2>
                <p className="text-slate-300 mt-2">{movie.director}</p>
              </div>
            )}

            {/* Menggunakan komponen MovieCast */}
            <MovieCast rawCast={cast} />
          </div>
        </div>
      </div>
    </div>
  )
}
