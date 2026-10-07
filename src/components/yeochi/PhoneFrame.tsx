import { ReactNode } from "react";

export function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen w-full gradient-soft flex items-center justify-center p-0 sm:p-6">
      <div className="relative w-full sm:max-w-[400px] h-screen sm:h-[844px] bg-background sm:rounded-[48px] overflow-hidden sm:border-[10px] sm:border-foreground/90 sm:shadow-[0_30px_80px_-30px_oklch(0.3_0.05_50/0.35)] flex flex-col">
        {/* Desktop-only device chrome: notch + status-bar spacer so sticky headers never sit under the notch. */}
        <div className="hidden sm:block absolute top-2.5 left-1/2 -translate-x-1/2 w-28 h-7 bg-foreground/90 rounded-full z-50" />
        <div className="hidden sm:block h-11 shrink-0 bg-background" />
        <div className="flex-1 overflow-y-auto scrollbar-hide">{children}</div>
      </div>
    </div>
  );
}
