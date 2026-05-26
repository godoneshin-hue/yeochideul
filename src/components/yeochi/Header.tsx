import { ChevronLeft, Home } from "lucide-react";
import { useApp } from "@/lib/yeochi-store";

export function Header({ title, showBack = true, showHome = true }: { title: string; showBack?: boolean; showHome?: boolean }) {
  const { go } = useApp();
  return (
    <div className="sticky top-0 z-40 backdrop-blur-xl bg-background/80 border-b border-border/50 px-4 py-3 flex items-center justify-between">
      {showBack ? (
        <button onClick={() => go("home")} className="p-2 -ml-2 rounded-full hover:bg-accent active:scale-90 transition">
          <ChevronLeft className="w-5 h-5" />
        </button>
      ) : <div className="w-9" />}
      <h1 className="font-semibold text-base">{title}</h1>
      {showHome ? (
        <button onClick={() => go("home")} className="p-2 -mr-2 rounded-full hover:bg-accent active:scale-90 transition">
          <Home className="w-5 h-5" />
        </button>
      ) : <div className="w-9" />}
    </div>
  );
}