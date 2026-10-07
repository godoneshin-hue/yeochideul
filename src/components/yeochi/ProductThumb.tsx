import { useState } from "react";
import type { Product } from "@/lib/yeochi-data";

type Category = "토너" | "에센스" | "앰플" | "크림" | "클렌징";

// Product photo when one is set; otherwise a quiet line illustration of the
// container type, so a missing photo still reads as "a product" instead of a
// placeholder letter.
export function ProductThumb({
  product,
  category,
  size = 72,
}: {
  product: Product;
  category: string;
  size?: number;
}) {
  const [broken, setBroken] = useState(false);
  const showPhoto = product.image && !broken;

  return (
    <div
      className="relative shrink-0 rounded-[14px] bg-surface overflow-hidden flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      {showPhoto ? (
        <img
          src={product.image}
          alt={`${product.brand} ${product.name}`}
          loading="lazy"
          onError={() => setBroken(true)}
          className="w-full h-full object-contain p-1.5 mix-blend-multiply"
        />
      ) : (
        <Illustration category={category as Category} label={product.brand} />
      )}
    </div>
  );
}

function Illustration({ category, label }: { category: Category; label: string }) {
  const stroke = "var(--primary)";
  const fill = "color-mix(in oklab, var(--primary) 14%, white)";
  const common = { stroke, strokeWidth: 1.4, strokeLinejoin: "round" as const };
  const text = (
    <text
      x="32"
      y="44"
      textAnchor="middle"
      fontSize="5"
      fontWeight={600}
      fill="var(--foreground)"
      opacity={0.55}
      style={{ letterSpacing: "0.04em" }}
    >
      {label.length > 9 ? label.slice(0, 9) : label}
    </text>
  );

  return (
    <svg viewBox="0 0 64 64" className="w-[78%] h-[78%]" aria-hidden>
      {category === "토너" && (
        <>
          <rect x="25" y="8" width="14" height="8" rx="2" fill="var(--card)" {...common} />
          <rect x="20" y="16" width="24" height="42" rx="6" fill={fill} {...common} />
          {text}
        </>
      )}
      {category === "에센스" && (
        <>
          <path d="M29 6h6v6h-6z" fill="var(--card)" {...common} />
          <rect x="26.5" y="12" width="11" height="6" rx="2" fill="var(--card)" {...common} />
          <rect x="19" y="18" width="26" height="40" rx="9" fill={fill} {...common} />
          {text}
        </>
      )}
      {category === "앰플" && (
        <>
          <ellipse cx="32" cy="9" rx="4" ry="4" fill="var(--card)" {...common} />
          <rect x="28" y="12" width="8" height="10" rx="2" fill="var(--card)" {...common} />
          <rect x="22" y="22" width="20" height="36" rx="5" fill={fill} {...common} />
          <text
            x="32"
            y="44"
            textAnchor="middle"
            fontSize="4.2"
            fontWeight={600}
            fill="var(--foreground)"
            opacity={0.55}
          >
            {label.length > 8 ? label.slice(0, 8) : label}
          </text>
        </>
      )}
      {category === "크림" && (
        <>
          <rect x="13" y="22" width="38" height="8" rx="3" fill="var(--card)" {...common} />
          <rect x="15" y="30" width="34" height="22" rx="6" fill={fill} {...common} />
          <text
            x="32"
            y="44"
            textAnchor="middle"
            fontSize="5"
            fontWeight={600}
            fill="var(--foreground)"
            opacity={0.55}
          >
            {label.length > 10 ? label.slice(0, 10) : label}
          </text>
        </>
      )}
      {category === "클렌징" && (
        <>
          <path d="M30 6h10v4h-6v4" fill="none" {...common} />
          <rect x="27" y="14" width="10" height="6" rx="2" fill="var(--card)" {...common} />
          <rect x="20" y="20" width="24" height="38" rx="7" fill={fill} {...common} />
          {text}
        </>
      )}
    </svg>
  );
}
