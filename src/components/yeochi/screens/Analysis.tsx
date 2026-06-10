import { useState } from "react";
import { useApp, fileToDataUrl } from "@/lib/yeochi-store";
import { Header } from "@/components/yeochi/Header";
import { PRODUCT_DB } from "@/lib/yeochi-data";
import { Camera, Sparkles, Upload, CheckCircle2, Circle, Star } from "lucide-react";

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
    score: number; redness: number; moisture: number;
    skinType: string; acne: { type: string; desc: string };
    picks: { cat: string; product: any; reason: string }[];
  }>(null);
  const [done, setDone] = useState<boolean[]>(Array(ROUTINES.length).fill(false));

  const onFile = async (f: File | null) => {
    if (!f) return;
    const u = await fileToDataUrl(f);
    setImg(u); setResult(null); setLoading(true);
    setTimeout(() => {
      const skinType = user.skinType && SKIN_TYPES.includes(user.skinType as any)
        ? user.skinType
        : SKIN_TYPES[Math.floor(Math.random() * SKIN_TYPES.length)];
      const acne = ACNE_TYPES[Math.floor(Math.random() * ACNE_TYPES.length)];
      const picks = [
        { cat: "클렌징", product: PRODUCT_DB["클렌징"][2], reason: `${skinType} 피부의 ${acne.type}에는 자극 없는 약산성 세안이 필수예요.` },
        { cat: "토너", product: PRODUCT_DB["토너"][0], reason: "어성초가 염증을 가라앉히고 유수분 밸런스를 잡아줘요." },
        { cat: "앰플", product: PRODUCT_DB["앰플"][0], reason: "병풀 100%로 붉은기와 트러블을 빠르게 진정시켜요." },
        { cat: "크림", product: PRODUCT_DB["크림"][0], reason: "수딩 크림으로 마무리해 장벽을 회복시켜 줘요." },
      ];
      setResult({
        score: 80 + Math.floor(Math.random() * 18),
        redness: 10 + Math.floor(Math.random() * 20),
        moisture: 50 + Math.floor(Math.random() * 30),
        skinType, acne, picks,
      });
      setLoading(false);
    }, 2200);
  };

  return (
    <>
      <Header title="AI 패치 분석" />
      <div className="p-5 animate-fade-in-up">
        <div className="bg-card rounded-2xl p-4 shadow-card border border-border/50 mb-4">
          <div className="text-xs font-bold mb-2">스캔 가이드</div>
          <ul className="text-[11px] text-muted-foreground space-y-1">
            <li>1. 밝은 곳에서 촬영해주세요</li>
            <li>2. 패치가 정중앙에 오도록 맞춰주세요</li>
            <li>3. 흔들리지 않게 주의해주세요</li>
          </ul>
        </div>

        <label className="block bg-card rounded-3xl p-6 shadow-card border-2 border-dashed border-primary/40 active:scale-98 transition">
          <input type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => onFile(e.target.files?.[0] || null)} />
          {img ? (
            <div className="relative">
              <img src={img} className="w-full aspect-square object-cover rounded-2xl" alt="scan" />
              {loading && (
                <div className="absolute inset-0 rounded-2xl bg-black/40 flex flex-col items-center justify-center text-white gap-3">
                  <div className="w-12 h-12 rounded-full border-4 border-white/30 border-t-white animate-spin" />
                  <div className="text-xs">AI가 패치 부위를 분석 중...</div>
                </div>
              )}
            </div>
          ) : (
            <div className="aspect-square flex flex-col items-center justify-center text-muted-foreground gap-3">
              <div className="w-20 h-20 rounded-full bg-primary/15 flex items-center justify-center">
                <Camera className="w-10 h-10 text-primary" />
              </div>
              <div className="text-sm font-semibold">탭하여 촬영</div>
              <div className="text-[11px] flex items-center gap-1"><Upload className="w-3 h-3" /> 또는 파일 업로드</div>
            </div>
          )}
        </label>

        {result && (
          <>
            <div className="mt-4 bg-card rounded-3xl p-5 shadow-card border border-border/50 animate-fade-in-up">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-primary" />
                <h3 className="font-bold text-sm">AI 분석 리포트</h3>
              </div>
              <div className="text-center mb-4">
                <div className="text-xs text-muted-foreground">오늘의 피부 점수</div>
                <div className="text-5xl font-extrabold text-primary">{result.score}</div>
              </div>
              <div className="grid grid-cols-2 gap-2 mb-4">
                <div className="bg-secondary/50 rounded-xl p-3">
                  <div className="text-[10px] text-muted-foreground">피부 타입</div>
                  <div className="font-bold text-sm">{result.skinType}</div>
                </div>
                <div className="bg-secondary/50 rounded-xl p-3">
                  <div className="text-[10px] text-muted-foreground">여드름 유형</div>
                  <div className="font-bold text-sm">{result.acne.type}</div>
                </div>
              </div>
              <div className="text-[11px] text-muted-foreground bg-accent/40 rounded-xl p-3 mb-4">
                {result.acne.desc}
              </div>
              <div className="space-y-3">
                <Metric label="붉은기 감소" value={result.redness} suffix="%" color="bg-rose-400" />
                <Metric label="수분도" value={result.moisture} suffix="%" color="bg-sky-400" />
              </div>
            </div>

            <div className="mt-4 bg-card rounded-3xl p-5 shadow-card border border-border/50 animate-fade-in-up">
              <h3 className="font-bold text-sm mb-3">맞춤 제품 추천</h3>
              <div className="space-y-3">
                {result.picks.map((p, i) => (
                  <div key={i} className="bg-secondary/40 rounded-2xl p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/15 text-primary font-semibold">{p.cat}</span>
                      <span className="text-[10px] text-muted-foreground">{p.product.brand}</span>
                      <span className="ml-auto text-[10px] flex items-center gap-0.5"><Star className="w-3 h-3 fill-amber-400 text-amber-400" />{p.product.score}</span>
                    </div>
                    <div className="font-bold text-xs mb-1">{p.product.name}</div>
                    <div className="text-[11px] text-foreground/80 mb-2">{p.reason}</div>
                    <div className="text-[10px] text-muted-foreground">{p.product.ingredients}</div>
                  </div>
                ))}
              </div>
              <button onClick={() => go("recommendation")} className="w-full mt-3 py-2.5 rounded-xl bg-secondary text-xs font-semibold active:scale-95 transition">
                더 많은 추천 보기 →
              </button>
            </div>

            <div className="mt-4 bg-card rounded-3xl p-5 shadow-card border border-border/50 animate-fade-in-up">
              <h3 className="font-bold text-sm mb-1">오늘의 케어 루틴</h3>
              <p className="text-[11px] text-muted-foreground mb-3">{result.skinType} · {result.acne.type} 맞춤</p>
              <div className="space-y-2">
                {ROUTINES.map((r, i) => (
                  <button key={i} onClick={() => setDone((d) => d.map((v, k) => k === i ? !v : v))}
                    className="w-full flex items-center gap-3 p-3 rounded-xl bg-secondary/40 active:scale-98 transition text-left">
                    {done[i] ? <CheckCircle2 className="w-5 h-5 text-primary shrink-0" /> : <Circle className="w-5 h-5 text-muted-foreground shrink-0" />}
                    <span className={`text-xs ${done[i] ? "line-through text-muted-foreground" : "font-semibold"}`}>{r}</span>
                  </button>
                ))}
              </div>
              <div className="mt-3 text-[10px] text-muted-foreground text-center">
                완료: {done.filter(Boolean).length} / {ROUTINES.length}
              </div>
            </div>

            <button onClick={() => go("home")} className="w-full mt-4 py-3 rounded-2xl bg-primary text-primary-foreground font-bold text-sm active:scale-95 transition">
              홈으로 돌아가기
            </button>
          </>
        )}
      </div>
    </>
  );
}

function Metric({ label, value, suffix, color }: { label: string; value: number; suffix: string; color: string }) {
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-bold">{value}{suffix}</span>
      </div>
      <div className="h-2 bg-secondary rounded-full overflow-hidden">
        <div className={`h-full ${color} transition-all`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}