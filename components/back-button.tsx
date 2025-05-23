"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export function BackButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="absolute top-4 left-4 z-20 bg-slate-800/80 p-2 rounded-full hover:bg-slate-700"
      aria-label="Kembali ke halaman sebelumnya"
    >
      <ArrowLeft className="h-6 w-6" />
    </button>
  );
}
