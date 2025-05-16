export default function Loading() {
    return (
      <div className="min-h-screen bg-slate-900 text-white">
        <div className="relative h-[50vh] w-full bg-slate-800 animate-pulse">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-900 z-10" />
        </div>
  
        <div className="container mx-auto px-4 py-8 -mt-32 relative z-20">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-1/3 lg:w-1/4">
              <div className="aspect-[2/3] relative rounded-lg overflow-hidden shadow-xl bg-slate-800 animate-pulse" />
            </div>
  
            <div className="w-full md:w-2/3 lg:w-3/4 space-y-4">
              <div className="h-10 bg-slate-800 animate-pulse rounded w-3/4" />
              <div className="h-6 bg-slate-800 animate-pulse rounded w-1/2" />
  
              <div className="flex gap-2 mt-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-6 w-16 bg-slate-800 animate-pulse rounded-full" />
                ))}
              </div>
  
              <div className="mt-6 space-y-2">
                <div className="h-6 bg-slate-800 animate-pulse rounded w-32" />
                <div className="h-4 bg-slate-800 animate-pulse rounded w-full" />
                <div className="h-4 bg-slate-800 animate-pulse rounded w-full" />
                <div className="h-4 bg-slate-800 animate-pulse rounded w-3/4" />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
  