import { LoadingAnimation } from "@/components/loading-animation"

export default function Loading() {
  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <header className="bg-slate-800 border-b border-slate-700 py-4">
        <div className="container mx-auto px-4">
          <div className="h-8 w-64 bg-slate-700 animate-pulse rounded" />
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        <LoadingAnimation />
      </main>
    </div>
  )
}
