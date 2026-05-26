import { useState } from "react";
import { useApp, fileToDataUrl } from "@/lib/yeochi-store";
import { Header } from "@/components/yeochi/Header";
import { Camera, Sparkles, Upload } from "lucide-react";

export function AnalysisScreen() {
  const { go } = useApp();
  const [img, setImg] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<null | { score: number; redness: number; moisture: number }>(null);

  const onFile = async (f: File | null) => {
    if (!f) return;
    const u = await fileToDataUrl(f);
    setImg(u); setResult(null); setLoading(true);
    setTimeout(() => {
      setResult({ score: 80 + Math.floor(Math.random() * 18), redness: 10 + Math.floor(Math.random() * 20), moisture: 50 + Math.floor(Math.random() * 30) });
      setLoading(false);
    }, 2200);
  };

  return (
    <>
      <Header title="AI 패치 분석" />
      <div className="p-5 animate-fade-in-up">
        <div className="bg-card rounded-2xl p-4 shadow-card border border-border/50 mb-4">
          <div className="text-xs font-bold mb-2">📸 스캔 가이드</div>
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
          <div className="mt-4 bg-card rounded-3xl p-5 shadow-card border border-border/50 animate-fade-in-up">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-primary" />
              <h3 className="font-bold text-sm">분석 리포트</h3>
            </div>
            <div className="text-center mb-4">
              <div className="text-xs text-muted-foreground">오늘의 피부 점수</div>
              <div className="text-5xl font-extrabold text-primary">{result.score}</div>
            </div>
            <div className="space-y-3">
              <Metric label="붉은기 감소" value={result.redness} suffix="%" color="bg-rose-400" />
              <Metric label="수분도 상승" value={result.moisture} suffix="%" color="bg-sky-400" />
            </div>
            <button onClick={() => go("home")} className="w-full mt-5 py-3 rounded-xl bg-primary text-primary-foreground font-bold text-sm active:scale-95 transition">
              홈으로 돌아가기
            </button>
          </div>
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