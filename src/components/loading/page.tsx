"use client";

import { cn } from "@/lib/utils";

export function Loading() {
  return (
    <div className="flex justify-center items-center h-screen">
      <div
        className={cn(
          "animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"
        )}
      ></div>
    </div>
  );
}
