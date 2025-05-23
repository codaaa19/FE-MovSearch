"use client"

export function LoadingAnimation() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] w-full">
      <div className="relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="film-reel-spinner">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="film-hole" style={{ transform: `rotate(${i * 60}deg) translateY(-25px)` }} />
            ))}
          </div>
        </div>
      </div>
      <p className="mt-8 text-rose-400 text-xl font-medium animate-pulse">Searching for movies...</p>
      <style jsx>{`
        .film-reel-spinner {
          width: 60px;
          height: 60px;
          border: 4px solid #f06e8e;
          border-radius: 50%;
          position: relative;
          animation: spin 2s linear infinite;
        }

        .film-hole {
          position: absolute;
          width: 12px;
          height: 12px;
          background-color: #1e293b;
          border: 2px solid #f06e8e;
          border-radius: 50%;
          top: 50%;
          left: 50%;
          margin-left: -6px;
          margin-top: -6px;
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  )
}
