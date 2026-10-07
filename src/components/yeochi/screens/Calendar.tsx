import { useState } from "react";
import { useApp, todayStr } from "@/lib/yeochi-store";
import { Header } from "@/components/yeochi/Header";
import { Card } from "@/components/yeochi/ui";
import { Droplet, Moon, ChevronLeft, ChevronRight } from "lucide-react";

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

  const dateStr = (d: number) =>
    `${ym.y}-${String(ym.m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

  const prev = () => setYm((p) => (p.m === 0 ? { y: p.y - 1, m: 11 } : { y: p.y, m: p.m - 1 }));
  const next = () => setYm((p) => (p.m === 11 ? { y: p.y + 1, m: 0 } : { y: p.y, m: p.m + 1 }));

  const rec = sel ? user.diary[sel] : null;
  const habit = sel ? user.habits[sel] : null;

  const selLabel = sel
    ? new Date(sel + "T00:00:00").toLocaleDateString("ko-KR", {
        month: "long",
        day: "numeric",
        weekday: "long",
      })
    : "";

  return (
    <>
      <Header title="여드름 달력" />
      <div className="px-5 pt-2 pb-10 animate-fade-in-up">
        <div className="flex items-center justify-between px-1 mb-4">
          <div className="text-[22px] font-bold tracking-[-0.03em] tabular-nums">
            {ym.y}. {String(ym.m + 1).padStart(2, "0")}
          </div>
          <div className="flex gap-1">
            <button
              onClick={prev}
              aria-label="이전 달"
              className="w-9 h-9 rounded-full border border-border flex items-center justify-center active:scale-90 transition"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={next}
              aria-label="다음 달"
              className="w-9 h-9 rounded-full border border-border flex items-center justify-center active:scale-90 transition"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <Card className="p-4">
          <div className="grid grid-cols-7 text-center text-[12px] text-muted-foreground mb-2">
            {["일", "월", "화", "수", "목", "금", "토"].map((d, i) => (
              <div key={d} className={i === 0 ? "text-rose-400" : ""}>
                {d}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-y-1">
            {cells.map((d, i) => {
              if (!d) return <div key={i} />;
              const ds = dateStr(d);
              const isToday = ds === today;
              const hasDiary = !!user.diary[ds];
              const hasHabit =
                !!user.habits[ds] && (user.habits[ds].water > 0 || user.habits[ds].sleep > 0);
              const isSel = sel === ds;
              return (
                <button
                  key={i}
                  onClick={() => setSel(ds)}
                  className="h-11 flex flex-col items-center justify-center gap-1"
                >
                  <span
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-[14px] tabular-nums transition
                    ${isSel ? "bg-foreground text-background font-semibold" : isToday ? "text-primary font-bold" : ""}`}
                  >
                    {d}
                  </span>
                  <span className="flex gap-0.5 h-1">
                    {hasDiary && <span className="w-1 h-1 rounded-full bg-primary" />}
                    {hasHabit && <span className="w-1 h-1 rounded-full bg-sky-400" />}
                  </span>
                </button>
              );
            })}
          </div>
          <div className="flex gap-4 mt-3 pt-3 border-t border-border text-[12px] text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" /> 피부 기록
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-400" /> 생활 습관
            </span>
          </div>
        </Card>

        {sel && (
          <div className="mt-8 animate-fade-in-up">
            <h3 className="text-[17px] font-semibold tracking-[-0.02em] px-1 mb-3">{selLabel}</h3>
            {rec ? (
              <Card className="overflow-hidden">
                {rec.img && (
                  <img src={rec.img} className="w-full aspect-[4/3] object-cover" alt="" />
                )}
                <div className="p-4 space-y-4">
                  <div className="flex items-baseline justify-between">
                    <span className="text-[14px] text-muted-foreground">피부 점수</span>
                    <span className="text-[22px] font-bold tabular-nums">
                      {rec.score}
                      <span className="text-[14px] font-medium text-muted-foreground">점</span>
                    </span>
                  </div>
                  {rec.desc && <p className="text-[15px] leading-relaxed">{rec.desc}</p>}
                  {rec.products.length > 0 && (
                    <div>
                      <div className="text-[13px] text-muted-foreground mb-2">사용 제품</div>
                      <div className="flex flex-wrap gap-1.5">
                        {rec.products.map((p) => (
                          <span
                            key={p}
                            className="text-[12px] h-7 px-2.5 inline-flex items-center rounded-full bg-surface"
                          >
                            {p}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            ) : (
              <div className="rounded-[20px] border border-dashed border-border py-10 text-center text-[14px] text-muted-foreground">
                이 날의 기록이 없어요
              </div>
            )}
            {habit && (habit.water > 0 || habit.sleep > 0) && (
              <Card className="mt-3 p-4 grid grid-cols-2">
                <div className="flex items-center gap-2 text-[14px]">
                  <Droplet className="w-4 h-4 text-sky-500" strokeWidth={1.75} />물 {habit.water}잔
                </div>
                <div className="flex items-center gap-2 text-[14px]">
                  <Moon className="w-4 h-4 text-indigo-500" strokeWidth={1.75} />
                  수면 {habit.sleep}시간
                </div>
              </Card>
            )}
          </div>
        )}
      </div>
    </>
  );
}
