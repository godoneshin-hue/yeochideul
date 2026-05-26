import { ReactNode } from "react";

export function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen w-full gradient-soft flex items-center justify-center p-0 sm:p-6">
      <div className="relative w-full sm:max-w-[420px] h-screen sm:h-[860px] bg-background sm:rounded-[44px] overflow-hidden sm:border-[10px] sm:border-foreground/90 shadow-soft flex flex-col">
        <div className="hidden sm:flex absolute top-2 left-1/2 -translate-x-1/2 w-32 h-6 bg-foreground/90 rounded-b-2xl z-50" />
        <div className="flex-1 overflow-y-auto scrollbar-hide">{children}</div>
      </div>
    </div>
  );
}