
export function Footer() {
  return (
    <footer className="bg-slate-800 border-t border-slate-700 py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center">
          <div className="flex items-center mb-4">
            <span className="text-xl font-bold text-rose-500">MovSearch</span>
          </div>

          <p className="text-slate-400 text-sm mb-4">© 2025 MovSearch. All rights reserved.</p>

          <div className="text-center">
            <ul className="text-slate-300 text-sm space-y-1">
              <li>Akmal Ramadhan - 2206081534</li>
              <li>Muh. Kemal Lathif Galih Putra - 2206081225</li>
              <li>Tsabit Coda Rafisukmawan - 2206081414</li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  )
}
