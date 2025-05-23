import { Film } from "lucide-react"

interface LogoProps {
  className?: string
}

export function Logo({ className }: LogoProps) {
  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className="bg-slate-700 p-6 rounded-full">
        <Film className="w-16 h-16 text-rose-500" />
      </div>
      <h1 className="text-4xl font-bold mt-4 text-white">MovSearch</h1>
      <p className="text-slate-300 mt-2">Temukan Film di Ujung Jari Anda</p>
    </div>
  )
}
