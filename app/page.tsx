"use client"

import { SearchForm } from "@/components/search-form"
import { Logo } from "@/components/logo"
import { Button } from "@/components/ui/button"
import { Info } from "lucide-react"
import { ProjectInfoModal } from "@/components/project-info-modal"
import { useState } from "react"

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-b from-slate-900 to-slate-800">
      <div className="w-full max-w-3xl mx-auto flex flex-col items-center justify-center gap-8 py-16">
        <Logo className="w-64 h-64" />
        <SearchForm />
      </div>
      <Button
        size="icon"
        className="fixed bottom-4 right-4 rounded-full w-12 h-12 bg-primary text-primary-foreground hover:bg-primary/90"
        onClick={() => setIsModalOpen(true)}
      >
        <Info className="w-6 h-6" />
      </Button>
      <ProjectInfoModal isOpen={isModalOpen} onOpenChange={setIsModalOpen} />
    </main>
  )
}
