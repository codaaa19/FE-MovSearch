"use client";

import { useState } from "react";

interface MovieCastProps {
  rawCast: string | string[] | undefined;
}

export function MovieCast({ rawCast }: MovieCastProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const allActors: string[] =
    typeof rawCast === "string"
      ? rawCast.split(", ").filter((actor) => actor.trim() !== "")
      : Array.isArray(rawCast)
      ? rawCast.filter((actor) => actor.trim() !== "")
      : [];

  if (allActors.length === 0) {
    return null;
  }

  const displayedActors = isExpanded ? allActors : allActors.slice(0, 10);
  const canExpand = allActors.length > 10;

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold">Pemeran</h2>
      <div className="flex flex-wrap gap-2 mt-2">
        {displayedActors.map((actor, index) => (
          <span
            key={index}
            className="text-sm bg-slate-800 text-slate-300 px-3 py-1 rounded-full"
          >
            {actor}
          </span>
        ))}
        {canExpand && !isExpanded && (
          <button
            onClick={() => setIsExpanded(true)}
            className="text-sm bg-slate-700 hover:bg-slate-600 text-slate-300 px-3 py-1 rounded-full cursor-pointer"
          >
            +{allActors.length - 10} lainnya
          </button>
        )}
        {canExpand && isExpanded && (
          <button
            onClick={() => setIsExpanded(false)}
            className="text-sm bg-slate-300 hover:bg-slate-50 text-slate-950 px-3 py-1 rounded-full cursor-pointer"
          >
            Tampilkan lebih sedikit
          </button>
        )}
      </div>
    </div>
  );
}
