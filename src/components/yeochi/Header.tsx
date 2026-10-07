import { ChevronLeft } from "lucide-react";
import { useApp } from "@/lib/yeochi-store";

export function Header({
  title,
  showBack = true,
}: {
  title: string;
  showBack?: boolean;
  showHome?: boolean;
}) {
  const { go } = useApp();
  return (
    <div className="sticky top-0 z-40 bg-background h-14 px-2 flex items-center">
      {showBack ? (
        <button
          onClick={() => go("home")}
          aria-label="홈으로"
          className="w-10 h-10 flex items-center justify-center rounded-full active:bg-surface transition"
        >
          <ChevronLeft className="w-6 h-6" strokeWidth={1.75} />
        </button>
      ) : (
        <div className="w-10" />
      )}
      <h1 className="flex-1 text-center text-[16px] font-semibold tracking-[-0.02em]">{title}</h1>
      <div className="w-10" />
    </div>
  );
}
