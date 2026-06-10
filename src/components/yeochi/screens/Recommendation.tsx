import { useState } from "react";
import { useApp } from "@/lib/yeochi-store";
import { Header } from "@/components/yeochi/Header";
import { PRODUCT_DB, CATEGORIES, Product } from "@/lib/yeochi-data";
import { Star, ChevronDown } from "lucide-react";

export function RecommendationScreen() {
  const { user } = useApp();
  const [cat, setCat] = useState<typeof CATEGORIES[number]>("토너");
  const [open, setOpen] = useState<string | null>(null);

  return (
    <>
      <Header title="제품추천" />
      <div className="px-5 pt-4 pb-8 animate-fade-in-up">
        <div className="bg-card rounded-2xl p-4 shadow-card border border-border/50 mb-4">
          <div className="text-[11px] text-muted-foreground">{user.skinType} 피부 · {user.concern}</div>
          <div className="text-sm font-bold mt-0.5">{user.name}님 맞춤 추천</div>
        </div>

        <div className="flex gap-2 overflow-x-auto scrollbar-hide -mx-5 px-5 mb-4">
          {CATEGORIES.map((c) => (
            <button key={c} onClick={() => setCat(c)}
              className={`shrink-0 px-5 py-2 rounded-full text-sm font-semibold transition active:scale-95
              ${cat === c ? "bg-primary text-primary-foreground shadow-soft" : "bg-secondary text-secondary-foreground"}`}>
              {c}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {PRODUCT_DB[cat].map((p) => (
            <ProductCard key={p.name} p={p} open={open === p.name} toggle={() => setOpen(open === p.name ? null : p.name)} />
          ))}
        </div>
      </div>
    </>
  );
}

function ProductCard({ p, open, toggle }: { p: Product; open: boolean; toggle: () => void }) {
  return (
    <div className="bg-card rounded-2xl shadow-card border border-border/50 overflow-hidden animate-fade-in-up">
      <button onClick={toggle} className="w-full p-4 flex items-center gap-3 text-left active:bg-secondary/40 transition">
        <div className="w-14 h-14 rounded-xl gradient-warm flex items-center justify-center text-2xl text-white shrink-0">
          {p.brand[0]}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[10px] text-muted-foreground">{p.brand}</div>
          <div className="font-bold text-sm truncate">{p.name}</div>
          <div className="flex items-center gap-2 mt-1">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span className="text-xs font-semibold">{p.score}</span>
            <span className="text-xs text-primary font-bold ml-auto">{p.price}</span>
          </div>
        </div>
        <ChevronDown className={`w-4 h-4 text-muted-foreground transition ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="px-4 pb-4 space-y-3 animate-fade-in-up">
          <div className="bg-secondary/40 rounded-xl p-3">
            <div className="text-[10px] text-muted-foreground mb-1">주요 성분</div>
            <div className="text-xs">{p.ingredients}</div>
          </div>
          <div className="bg-secondary/40 rounded-xl p-3">
            <div className="text-[10px] text-muted-foreground mb-1">기대 효과</div>
            <div className="text-xs">{p.effect}</div>
          </div>
          <div>
            <div className="text-[10px] text-muted-foreground mb-1.5 px-1">💬 리뷰</div>
            <div className="space-y-1.5">
              {p.reviews.map((r, i) => (
                <div key={i} className="text-xs bg-accent/40 rounded-lg px-3 py-2">"{r}"</div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}