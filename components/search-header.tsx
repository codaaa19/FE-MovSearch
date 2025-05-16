"use client"

import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SearchHeaderProps {
  query: string
  resultCount: number
  isSemanticSearch?: boolean
}

export function SearchHeader({ query, resultCount, isSemanticSearch = false }: SearchHeaderProps) {
  const router = useRouter()

  return (
    <header className="bg-slate-800 border-b border-slate-700 py-4">
      <div className="container mx-auto px-4 flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push("/")}
          className="text-slate-300 hover:text-white hover:bg-slate-700"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>

        <div>
          <h1 className="text-xl font-semibold text-white">
            {isSemanticSearch ? "Semantic Search" : "Keyword Search"}: {query}
          </h1>
          <p className="text-slate-300 text-sm">
            Found {resultCount} {resultCount === 1 ? "result" : "results"}
          </p>
        </div>
      </div>
    </header>
  )
}
