import { useState } from "react";
import { useApp, fileToDataUrl } from "@/lib/yeochi-store";
import { Header } from "@/components/yeochi/Header";
import { PRODUCT_DB, Product, oliveYoungUrl } from "@/lib/yeochi-data";
import { ProductThumb } from "@/components/yeochi/ProductThumb";
import { Card, PrimaryButton, SecondaryButton, SectionTitle } from "@/components/yeochi/ui";
import { Camera, Check, Star, ArrowUpRight } from "lucide-react";

const SKIN_TYPES = ["건성", "복합성", "지성", "민감성"] as const;
const ACNE_TYPES = [
  { type: "좁쌀 여드름", desc: "모공 입구가 막혀 생긴 작은 면포성 여드름이에요." },
  { type: "화농성 여드름", desc: "염증이 진행되어 붉고 통증이 있는 여드름이에요." },
  { type: "블랙헤드", desc: "산화된 피지로 인해 모공이 검게 보이는 상태예요." },
  { type: "붉은기/색소침착", desc: "여드름이 가라앉은 후 남은 자국이에요." },
];

const ROUTINES = [
  "물 8잔 이상 마시기",
  "약산성 클렌징폼으로 미온수 세안",
  "진정 토너로 결 정돈하기",
  "보습 앰플/세럼 얇게 레이어링",
  "11시 전 취침 · 베개커버 교체",
];

export function AnalysisScreen() {
  const { user, go } = useApp();
  const [img, setImg] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<null | {
    score: number;
    redness: number;
    moisture: number;
    skinType: string;
    acne: { type: string; desc: string };
    picks: { cat: string; product: Product; reason: string }[];
  }>(null);
  const [done, setDone] = useState<boolean[]>(Array(ROUTINES.length).fill(false));

  const onFile = async (f: File | null) => {
    if (!f) return;
    const u = await fileToDataUrl(f);
    setImg(u);
    setResult(null);
    setLoading(true);
    setTimeout(() => {
      const skinType =
        user.skinType && (SKIN_TYPES as readonly string[]).includes(user.skinType)
          ? user.skinType
          : SKIN_TYPES[Math.floor(Math.random() * SKIN_TYPES.length)];
      const acne = ACNE_TYPES[Math.floor(Math.random() * ACNE_TYPES.length)];
      const picks = [
        {
          cat: "클렌징",
          product: PRODUCT_DB["클렌징"][2],
          reason: `${skinType} 피부의 ${acne.type}에는 자극 없는 약산성 세안이 필수예요.`,
        },
        {
          cat: "토너",
          product: PRODUCT_DB["토너"][0],
          reason: "어성초가 염증을 가라앉히고 유수분 밸런스를 잡아줘요.",
        },
        {
          cat: "앰플",
          product: PRODUCT_DB["앰플"][0],
          reason: "병풀 100%로 붉은기와 트러블을 빠르게 진정시켜요.",
        },
        {
          cat: "크림",
          product: PRODUCT_DB["크림"][0],
          reason: "수딩 크림으로 마무리해 장벽을 회복시켜 줘요.",
        },
      ];
      setResult({
        score: 80 + Math.floor(Math.random() * 18),
        redness: 10 + Math.floor(Math.random() * 20),
        moisture: 50 + Math.floor(Math.random() * 30),
        skinType,
        acne,
        picks,
      });
      setLoading(false);
    }, 2200);
  };

  return (
    <>
      <Header title="패치 분석" />
      <div className="px-5 pt-2 pb-10 animate-fade-in-up">
        {!result && (
          <div className="px-1 mb-5">
            <h2 className="text-[22px] leading-[1.35] font-bold tracking-[-0.03em]">
              패치 부위를
              <br />
              가운데에 맞춰 찍어주세요
            </h2>
            <ol className="mt-3 space-y-1 text-[14px] text-muted-foreground">
              <li>· 밝은 곳에서 촬영해주세요</li>
              <li>· 패치가 화면 정중앙에 오도록 맞춰주세요</li>
              <li>· 흔들리지 않게 잠시 멈춰주세요</li>
            </ol>
          </div>
        )}

        <label className="block cursor-pointer">
          <input
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={(e) => onFile(e.target.files?.[0] || null)}
          />
          {img ? (
            <div className="relative">
              <img src={img} className="w-full aspect-square object-cover rounded-[20px]" alt="" />
              {loading && (
                <div className="absolute inset-0 rounded-[20px] bg-black/45 flex flex-col items-center justify-center text-white gap-3">
                  <div className="w-10 h-10 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  <div className="text-[14px]">피부 상태를 분석하고 있어요</div>
                </div>
              )}
            </div>
          ) : (
            <div className="aspect-square rounded-[20px] bg-surface relative flex flex-col items-center justify-center gap-3 text-muted-foreground">
              {/* viewfinder corners */}
              <span className="absolute top-6 left-6 w-8 h-8 border-t-2 border-l-2 border-foreground/30 rounded-tl-lg" />
              <span className="absolute top-6 right-6 w-8 h-8 border-t-2 border-r-2 border-foreground/30 rounded-tr-lg" />
              <span className="absolute bottom-6 left-6 w-8 h-8 border-b-2 border-l-2 border-foreground/30 rounded-bl-lg" />
              <span className="absolute bottom-6 right-6 w-8 h-8 border-b-2 border-r-2 border-foreground/30 rounded-br-lg" />
              <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center">
                <Camera className="w-7 h-7 text-primary-foreground" strokeWidth={1.75} />
              </div>
              <div className="text-[15px] font-medium text-foreground">촬영 또는 사진 선택</div>
            </div>
          )}
        </label>

        {result && (
          <>
            <Card className="mt-4 p-5 animate-fade-in-up">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-[13px] text-muted-foreground">오늘의 피부 점수</div>
                  <div className="text-[44px] leading-none font-bold tracking-[-0.04em] tabular-nums mt-2">
                    {result.score}
                    <span className="text-[16px] font-medium text-muted-foreground ml-1">
                      / 100
                    </span>
                  </div>
                </div>
                <div className="text-right text-[13px] space-y-1 mt-1">
                  <div>
                    <span className="text-muted-foreground">타입 </span>
                    <b className="font-semibold">{result.skinType}</b>
                  </div>
                  <div>
                    <span className="text-muted-foreground">유형 </span>
                    <b className="font-semibold">{result.acne.type}</b>
                  </div>
                </div>
              </div>
              <p className="text-[14px] text-secondary-foreground mt-4 leading-relaxed">
                {result.acne.desc}
              </p>
              <div className="space-y-4 mt-5 pt-5 border-t border-border">
                <Metric label="붉은기 감소" value={result.redness} color="bg-rose-400" />
                <Metric label="수분도" value={result.moisture} color="bg-sky-400" />
              </div>
            </Card>

            <div className="mt-8 animate-fade-in-up">
              <SectionTitle hint="분석 결과에 맞춘 단계별 제품">추천 루틴 제품</SectionTitle>
              <Card className="divide-y divide-border overflow-hidden">
                {result.picks.map((p, i) => (
                  <div key={i} className="p-4">
                    <div className="flex gap-3.5">
                      <ProductThumb product={p.product} category={p.cat} size={64} />
                      <div className="flex-1 min-w-0">
                        <div className="text-[12px] text-primary font-semibold">
                          {i + 1}단계 · {p.cat}
                        </div>
                        <div className="text-[15px] font-semibold leading-snug mt-0.5">
                          {p.product.name}
                        </div>
                        <div className="text-[13px] text-muted-foreground flex items-center gap-1 mt-0.5">
                          {p.product.brand}
                          <span className="mx-1 w-px h-3 bg-border" />
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          {p.product.score}
                        </div>
                      </div>
                    </div>
                    <p className="text-[14px] text-secondary-foreground mt-3 leading-relaxed">
                      {p.reason}
                    </p>
                    <a
                      href={oliveYoungUrl(p.product)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-flex items-center gap-1 text-[13px] font-medium text-foreground/80 underline underline-offset-4 decoration-border"
                    >
                      올리브영에서 보기 <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                ))}
              </Card>
              <SecondaryButton onClick={() => go("recommendation")} className="mt-3">
                추천 제품 더 보기
              </SecondaryButton>
            </div>

            <div className="mt-8 animate-fade-in-up">
              <SectionTitle
                hint={`${result.skinType} · ${result.acne.type} 맞춤`}
                action={
                  <span className="text-[13px] text-muted-foreground tabular-nums">
                    {done.filter(Boolean).length}/{ROUTINES.length}
                  </span>
                }
              >
                오늘의 케어 루틴
              </SectionTitle>
              <Card className="divide-y divide-border overflow-hidden">
                {ROUTINES.map((r, i) => (
                  <button
                    key={i}
                    onClick={() => setDone((d) => d.map((v, k) => (k === i ? !v : v)))}
                    className="w-full flex items-center gap-3 px-4 h-14 text-left active:bg-surface transition"
                  >
                    <span
                      className={`w-5 h-5 rounded-full shrink-0 flex items-center justify-center border ${done[i] ? "bg-primary border-primary text-primary-foreground" : "border-border"}`}
                    >
                      {done[i] && <Check className="w-3 h-3" strokeWidth={3} />}
                    </span>
                    <span
                      className={`text-[15px] ${done[i] ? "line-through text-muted-foreground" : ""}`}
                    >
                      {r}
                    </span>
                  </button>
                ))}
              </Card>
            </div>

            <PrimaryButton onClick={() => go("home")} className="mt-8">
              홈으로
            </PrimaryButton>
          </>
        )}
      </div>
    </>
  );
}

function Metric({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div>
      <div className="flex justify-between text-[14px] mb-2">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-semibold tabular-nums">{value}%</span>
      </div>
      <div className="h-1.5 bg-surface rounded-full overflow-hidden">
        <div
          className={`h-full ${color} rounded-full transition-all`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}
