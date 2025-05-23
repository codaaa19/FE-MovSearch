"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Info } from "lucide-react"
import type { Movie } from "@/lib/types"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface MovieCardProps {
  movie: Movie
  showScore?: boolean
}

export function MovieCard({ movie, showScore }: MovieCardProps) {
  const [showInfo, setShowInfo] = useState(false)

  const genres = typeof movie.genres === "string" ? movie.genres.split(", ") : movie.genres

  return (
    <div className="group relative bg-slate-800 rounded-lg overflow-hidden shadow-lg transition-all hover:shadow-xl hover:scale-[1.02]">
      <Link href={`/movie/${movie.id}`} className="block">
        <div className="aspect-[2/3] relative">
          <Image
            src={movie.poster_path || "/placeholder.svg?height=450&width=300"}
            alt={movie.title}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        <div className="p-4">
          <h3 className="font-semibold text-lg line-clamp-1">{movie.title}</h3>
          <p className="text-slate-300 text-sm mt-1">{movie.release_date?.substring(0, 4) || "Unknown year"}</p>
          {showScore && movie.score !== undefined && (
            <p className="text-xs text-rose-400 mt-1">Score: {movie.score.toFixed(4)}</p>
          )}

          <div className="flex flex-wrap gap-1 mt-2">
            {Array.isArray(genres) &&
              genres.slice(0, 3).map((genre, index) => (
                <span key={index} className="text-xs bg-slate-700 text-slate-300 px-2 py-1 rounded-full">
                  {genre}
                </span>
              ))}
            {Array.isArray(genres) && genres.length > 3 && (
              <span className="text-xs bg-slate-700 text-slate-300 px-2 py-1 rounded-full">+{genres.length - 3}</span>
            )}
          </div>
        </div>
      </Link>

      <Dialog>
        <DialogTrigger asChild>
          <Button variant="ghost" size="icon" className="absolute top-2 right-2 bg-slate-800/80 hover:bg-slate-700">
            <Info className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-slate-800 text-white border-slate-700">
          <DialogHeader>
            <DialogTitle>{movie.title}</DialogTitle>
            <DialogDescription className="text-slate-300">Search relevance information</DialogDescription>
          </DialogHeader>

          <div className="mt-4 space-y-4">
            <div>
              <h4 className="font-medium text-rose-400">Search Score</h4>
              <p className="text-slate-300">{movie.score?.toFixed(4) || "N/A"}</p>
            </div>

            <div>
              <h4 className="font-medium text-rose-400">Rating</h4>
              <p className="text-slate-300">{movie.vote_average || movie.imdb_rating || "N/A"}</p>
            </div>

            <div>
              <h4 className="font-medium text-rose-400">Release Date</h4>
              <p className="text-slate-300">{movie.release_date || "Unknown"}</p>
            </div>

            <div>
              <h4 className="font-medium text-rose-400">Genres</h4>
              <p className="text-slate-300">{typeof genres === "string" ? genres : genres?.join(", ") || "Unknown"}</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
