import { useState } from "react";
import { useApp } from "@/lib/yeochi-store";
import { Header } from "@/components/yeochi/Header";
import { ProductThumb } from "@/components/yeochi/ProductThumb";
import { Card, Chip, Divider } from "@/components/yeochi/ui";
import { PRODUCT_DB, CATEGORIES, Product, oliveYoungUrl } from "@/lib/yeochi-data";
import { Star, ChevronDown, ArrowUpRight } from "lucide-react";

export function RecommendationScreen() {
  const { user } = useApp();
  const [cat, setCat] = useState<(typeof CATEGORIES)[number]>("토너");
  const [open, setOpen] = useState<string | null>(null);

  return (
    <>
      <Header title="제품 추천" />
      <div className="px-5 pt-2 pb-10 animate-fade-in-up">
        <div className="px-1 mb-5">
          <div className="text-[13px] text-muted-foreground">
            {user.skinType} 피부 · {user.concern}
          </div>
          <h2 className="text-[22px] leading-[1.35] font-bold tracking-[-0.03em] mt-1">
            {user.name}님 피부에
            <br />
            맞춘 제품이에요
          </h2>
        </div>

        <div className="sticky top-14 z-30 -mx-5 px-5 py-2 bg-background">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {CATEGORIES.map((c) => (
              <Chip key={c} active={cat === c} onClick={() => setCat(c)}>
                {c}
              </Chip>
            ))}
          </div>
        </div>

        <div className="space-y-3 mt-3">
          {PRODUCT_DB[cat].map((p, i) => (
            <ProductCard
              key={p.name}
              p={p}
              rank={i + 1}
              category={cat}
              open={open === p.name}
              toggle={() => setOpen(open === p.name ? null : p.name)}
            />
          ))}
        </div>

        <p className="text-[12px] text-muted-foreground/80 text-center mt-6 leading-relaxed">
          가격과 재고는 올리브영 기준으로 달라질 수 있어요.
        </p>
      </div>
    </>
  );
}

function ProductCard({
  p,
  rank,
  category,
  open,
  toggle,
}: {
  p: Product;
  rank: number;
  category: string;
  open: boolean;
  toggle: () => void;
}) {
  return (
    <Card className="overflow-hidden">
      <button onClick={toggle} className="w-full p-4 flex items-center gap-4 text-left">
        <div className="relative">
          <ProductThumb product={p} category={category} size={76} />
          <span className="absolute -top-1.5 -left-1.5 w-6 h-6 rounded-full bg-foreground text-background text-[12px] font-semibold flex items-center justify-center tabular-nums">
            {rank}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[13px] text-muted-foreground">{p.brand}</div>
          <div className="text-[15px] font-semibold leading-snug tracking-[-0.02em] line-clamp-2">
            {p.name}
          </div>
          <div className="flex items-center gap-2 mt-1.5 text-[13px]">
            <span className="flex items-center gap-0.5 font-medium">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              {p.score}
            </span>
            <span className="w-px h-3 bg-border" />
            <span className="font-semibold tabular-nums">{p.price}</span>
          </div>
        </div>
        <ChevronDown
          className={`w-5 h-5 text-muted-foreground shrink-0 transition ${open ? "rotate-180" : ""}`}
          strokeWidth={1.75}
        />
      </button>

      {open && (
        <div className="px-4 pb-4 animate-fade-in-up">
          <dl className="grid grid-cols-[64px_1fr] gap-y-2.5 text-[14px] bg-surface rounded-[14px] p-4">
            <dt className="text-muted-foreground">주요 성분</dt>
            <dd>{p.ingredients}</dd>
            <dt className="text-muted-foreground">기대 효과</dt>
            <dd>{p.effect}</dd>
          </dl>
          <div className="mt-4">
            <div className="text-[13px] text-muted-foreground mb-2 px-0.5">사용자 리뷰</div>
            <ul className="space-y-2">
              {p.reviews.map((r, i) => (
                <li key={i} className="text-[14px] pl-3 border-l-2 border-primary/40">
                  {r}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <Divider />
      <a
        href={oliveYoungUrl(p)}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-between px-4 h-12 text-[14px] font-medium active:bg-surface transition"
      >
        <span className="flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-[#9bce26] text-white text-[10px] font-bold flex items-center justify-center">
            O
          </span>
          올리브영에서 보기
        </span>
        <ArrowUpRight className="w-4 h-4 text-muted-foreground" strokeWidth={1.75} />
      </a>
    </Card>
  );
}
