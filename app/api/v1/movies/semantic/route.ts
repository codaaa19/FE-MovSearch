import { type NextRequest, NextResponse } from "next/server"
import { searchMovies } from "@/lib/search"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const { query, filters, size = 10 } = body

    const movies = await searchMovies({
      query,
      size,
      filters,
      type: "semantic",
    })

    return NextResponse.json(movies)
  } catch (error) {
    console.error("Error searching movies:", error)
    return NextResponse.json({ error: "Failed to search movies" }, { status: 500 })
  }
}
