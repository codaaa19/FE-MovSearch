"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { FilterIcon } from "lucide-react"

export function SearchForm() {
  const router = useRouter()
  const [query, setQuery] = useState("")
  const [isSemanticSearch, setIsSemanticSearch] = useState(false)

  // Filter states
  const [yearMin, setYearMin] = useState(1900)
  const [yearMax, setYearMax] = useState(new Date().getFullYear())
  const [ratingMin, setRatingMin] = useState(0)
  const [selectedGenres, setSelectedGenres] = useState<string[]>([])
  const [size, setSize] = useState(10)

  const genres = [
    "Action",
    "Adventure",
    "Animation",
    "Comedy",
    "Crime",
    "Documentary",
    "Drama",
    "Family",
    "Fantasy",
    "History",
    "Horror",
    "Music",
    "Mystery",
    "Romance",
    "Science Fiction",
    "Thriller",
    "War",
    "Western",
  ]

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()

    if (!query.trim()) return

    if (isSemanticSearch) {
      // For semantic search, we'll use a POST request with body
      const searchParams = {
        query,
        filters: {
          genres: selectedGenres.length > 0 ? selectedGenres : undefined,
          year: { min: yearMin, max: yearMax },
          rating: { min: ratingMin },
        },
        size,
      }

      router.push(`/search/semantic?q=${encodeURIComponent(JSON.stringify(searchParams))}`)
    } else {
      // For keyword search, we'll use URL parameters
      let searchUrl = `/search?query=${encodeURIComponent(query)}&size=${size}`

      if (yearMin > 1900) searchUrl += `&year_min=${yearMin}`
      if (yearMax < new Date().getFullYear()) searchUrl += `&year_max=${yearMax}`
      if (ratingMin > 0) searchUrl += `&rating_min=${ratingMin}`
      if (selectedGenres.length > 0) searchUrl += `&genres=${selectedGenres.join(",")}`

      router.push(searchUrl)
    }
  }

  const toggleGenre = (genre: string) => {
    setSelectedGenres((prev) => (prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]))
  }

  return (
    <div className="w-full">
      <form onSubmit={handleSearch} className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Input
              type="text"
              placeholder="Search for movies..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10 h-12 bg-slate-700 border-slate-600 text-white"
            />
            <Search className="absolute left-3 top-3 h-6 w-6 text-slate-400" />
          </div>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="h-12 w-12 bg-slate-700 border-slate-600">
                <FilterIcon className="h-5 w-5 text-slate-300" />
              </Button>
            </SheetTrigger>
            <SheetContent className="bg-slate-800 text-white border-slate-700">
              <SheetHeader>
                <SheetTitle className="text-white">Search Filters</SheetTitle>
                <SheetDescription className="text-slate-300">Refine your movie search results</SheetDescription>
              </SheetHeader>

              <div className="mt-6 space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="year-range" className="text-slate-300">
                    Release Year Range
                  </Label>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-400">{yearMin}</span>
                    <span className="text-sm text-slate-400">{yearMax}</span>
                  </div>
                  <div className="flex gap-4">
                    <Input
                      type="number"
                      min={1900}
                      max={yearMax}
                      value={yearMin}
                      onChange={(e) => setYearMin(Number(e.target.value))}
                      className="bg-slate-700 border-slate-600"
                    />
                    <Input
                      type="number"
                      min={yearMin}
                      max={new Date().getFullYear()}
                      value={yearMax}
                      onChange={(e) => setYearMax(Number(e.target.value))}
                      className="bg-slate-700 border-slate-600"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="rating" className="text-slate-300">
                    Minimum Rating
                  </Label>
                  <div className="flex items-center gap-4">
                    <Slider
                      id="rating"
                      min={0}
                      max={10}
                      step={0.1}
                      value={[ratingMin]}
                      onValueChange={(value) => setRatingMin(value[0])}
                      className="flex-1"
                    />
                    <span className="min-w-12 text-center text-slate-300">{ratingMin.toFixed(1)}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="size" className="text-slate-300">
                    Results Per Page
                  </Label>
                  <Select value={size.toString()} onValueChange={(value) => setSize(Number(value))}>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue placeholder="Select size" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600 text-white">
                      <SelectItem value="5">5</SelectItem>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="20">20</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300">Genres</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {genres.map((genre) => (
                      <div key={genre} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id={`genre-${genre}`}
                          checked={selectedGenres.includes(genre)}
                          onChange={() => toggleGenre(genre)}
                          className="rounded text-rose-500 bg-slate-700 border-slate-600"
                        />
                        <Label htmlFor={`genre-${genre}`} className="text-sm text-slate-300">
                          {genre}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Switch
              id="search-type"
              checked={isSemanticSearch}
              onCheckedChange={setIsSemanticSearch}
              className="data-[state=checked]:bg-rose-500"
            />
            <Label htmlFor="search-type" className="text-white">
              {isSemanticSearch ? "Semantic Search" : "Keyword Search"}
            </Label>
          </div>

          <Button type="submit" className="bg-rose-500 hover:bg-rose-600">
            Search
          </Button>
        </div>
      </form>
    </div>
  )
}
