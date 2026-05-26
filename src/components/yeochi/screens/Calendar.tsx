import { useState } from "react";
import { useApp, todayStr } from "@/lib/yeochi-store";
import { Header } from "@/components/yeochi/Header";
import { Droplet, Moon } from "lucide-react";

export function CalendarScreen() {
  const { user } = useApp();
  const now = new Date();
  const [ym, setYm] = useState({ y: now.getFullYear(), m: now.getMonth() });
  const [sel, setSel] = useState<string | null>(todayStr());

  const first = new Date(ym.y, ym.m, 1);
  const startWeekday = first.getDay();
  const daysInMonth = new Date(ym.y, ym.m + 1, 0).getDate();
  const today = todayStr();

  const cells: (number | null)[] = [
    ...Array(startWeekday).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const dateStr = (d: number) => `${ym.y}-${String(ym.m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

  const prev = () => setYm((p) => p.m === 0 ? { y: p.y - 1, m: 11 } : { y: p.y, m: p.m - 1 });
  const next = () => setYm((p) => p.m === 11 ? { y: p.y + 1, m: 0 } : { y: p.y, m: p.m + 1 });

  const rec = sel ? user.diary[sel] : null;
  const habit = sel ? user.habits[sel] : null;

  return (
    <>
      <Header title="여드름 달력" />
      <div className="p-5 animate-fade-in-up">
        <div className="bg-card rounded-3xl p-5 shadow-card border border-border/50">
          <div className="flex items-center justify-between mb-4">
            <button onClick={prev} className="w-8 h-8 rounded-full bg-secondary active:scale-90 transition">‹</button>
            <div className="font-bold">{ym.y}년 {ym.m + 1}월</div>
            <button onClick={next} className="w-8 h-8 rounded-full bg-secondary active:scale-90 transition">›</button>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-[10px] text-muted-foreground font-bold mb-1">
            {["일", "월", "화", "수", "목", "금", "토"].map((d, i) => (
              <div key={d} className={i === 0 ? "text-rose-400" : i === 6 ? "text-sky-400" : ""}>{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {cells.map((d, i) => {
              if (!d) return <div key={i} />;
              const ds = dateStr(d);
              const isToday = ds === today;
              const hasDiary = !!user.diary[ds];
              const hasHabit = !!user.habits[ds] && (user.habits[ds].water > 0 || user.habits[ds].sleep > 0);
              const isSel = sel === ds;
              return (
                <button key={i} onClick={() => setSel(ds)}
                  className={`aspect-square rounded-xl text-xs font-semibold relative transition active:scale-90 flex flex-col items-center justify-center
                  ${isSel ? "bg-primary text-primary-foreground shadow-soft" : isToday ? "bg-primary/15 text-primary" : "hover:bg-secondary"}`}>
                  <span>{d}</span>
                  <div className="flex gap-0.5 mt-0.5 h-1">
                    {hasDiary && <span className={`w-1 h-1 rounded-full ${isSel ? "bg-white" : "bg-primary"}`} />}
                    {hasHabit && <span className={`w-1 h-1 rounded-full ${isSel ? "bg-white" : "bg-sky-400"}`} />}
                  </div>
                </button>
              );
            })}
          </div>
          <div className="flex gap-3 mt-3 text-[10px] text-muted-foreground">
            <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-primary" /> 기록</span>
            <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-sky-400" /> 생활습관</span>
          </div>
        </div>

        {sel && (
          <div className="mt-5 animate-fade-in-up">
            <h3 className="font-bold text-sm mb-3 px-1">📅 {sel}</h3>
            {rec ? (
              <div className="bg-card rounded-2xl p-4 shadow-card border border-border/50 space-y-3">
                {rec.img && <img src={rec.img} className="w-full aspect-video object-cover rounded-xl" alt="diary" />}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">피부 점수</span>
                  <span className="font-bold text-primary">{rec.score}점</span>
                </div>
                {rec.desc && <div className="text-xs bg-secondary/50 rounded-lg p-3">{rec.desc}</div>}
                {rec.products.length > 0 && (
                  <div>
                    <div className="text-[11px] text-muted-foreground mb-1.5">🧴 사용 제품</div>
                    <div className="flex flex-wrap gap-1.5">
                      {rec.products.map((p) => (
                        <span key={p} className="text-[10px] px-2 py-1 rounded-full bg-primary/10 text-primary font-medium">{p}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-card rounded-2xl p-6 text-center text-xs text-muted-foreground border border-dashed border-border">
                이 날의 기록이 없어요
              </div>
            )}
            {habit && (habit.water > 0 || habit.sleep > 0) && (
              <div className="mt-3 bg-card rounded-2xl p-4 shadow-card border border-border/50">
                <div className="text-xs font-bold mb-2">💧 생활 습관 기록</div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2"><Droplet className="w-4 h-4 text-sky-500" /><span className="text-xs">물 {habit.water}잔</span></div>
                  <div className="flex items-center gap-2"><Moon className="w-4 h-4 text-indigo-500" /><span className="text-xs">수면 {habit.sleep}시간</span></div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}