"use client";

import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface LoadingProps {
  showText?: boolean;
}
export function Loading({ showText = false }: LoadingProps) {
  if (showText) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="bg-background rounded-md p-4 flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Carregando...</span>
        </div>
      </div>
    );
  }
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
