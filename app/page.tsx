import { SearchForm } from "@/components/search-form"
import { Logo } from "@/components/logo"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-b from-slate-900 to-slate-800">
      <div className="w-full max-w-3xl mx-auto flex flex-col items-center justify-center gap-8">
        <Logo className="w-64 h-64" />
        <SearchForm />
      </div>
    </main>
  )
}
