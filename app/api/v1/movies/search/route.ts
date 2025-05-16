import { type NextRequest, NextResponse } from "next/server"
import { searchMovies } from "@/lib/search"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams

  const query = searchParams.get("query") || ""
  const size = Number.parseInt(searchParams.get("size") || "10")
  const yearMin = Number.parseInt(searchParams.get("year_min") || "0")
  const yearMax = Number.parseInt(searchParams.get("year_max") || "0")
  const ratingMin = Number.parseFloat(searchParams.get("rating_min") || "0")
  const genres = searchParams.get("genres") ? searchParams.get("genres")?.split(",") : []

  try {
    const movies = await searchMovies({
      query,
      size,
      filters: {
        year: {
          min: yearMin || undefined,
          max: yearMax || undefined,
        },
        rating: {
          min: ratingMin || undefined,
        },
        genres: genres?.length ? genres : undefined,
      },
      type: "keyword",
    })

    return NextResponse.json(movies)
  } catch (error) {
    console.error("Error searching movies:", error)
    return NextResponse.json({ error: "Failed to search movies" }, { status: 500 })
  }
}
