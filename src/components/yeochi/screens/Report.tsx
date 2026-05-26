import { useApp } from "@/lib/yeochi-store";
import { Header } from "@/components/yeochi/Header";

export function ReportScreen() {
  const { user } = useApp();
  const entries = Object.values(user.diary).sort((a, b) => a.date.localeCompare(b.date));
  const avg = entries.length ? Math.round(entries.reduce((s, e) => s + e.score, 0) / entries.length) : 0;
  const max = 100;

  return (
    <>
      <Header title="여드름 리포트" />
      <div className="p-5 space-y-4 animate-fade-in-up">
        <div className="bg-card rounded-3xl p-5 shadow-card border border-border/50">
          <div className="flex items-end justify-between mb-1">
            <div>
              <div className="text-xs text-muted-foreground">평균 피부 점수</div>
              <div className="text-4xl font-extrabold text-primary">{avg}<span className="text-sm text-muted-foreground">점</span></div>
            </div>
            <div className="text-xs text-muted-foreground">{entries.length}일 기록</div>
          </div>
        </div>

        <div className="bg-card rounded-3xl p-5 shadow-card border border-border/50">
          <h3 className="text-sm font-bold mb-4">📈 점수 트렌드</h3>
          {entries.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-6">기록을 추가하면 그래프가 표시돼요</p>
          ) : (
            <div className="flex items-end gap-1.5 h-32">
              {entries.slice(-14).map((e) => (
                <div key={e.date} className="flex-1 flex flex-col items-center gap-1" title={`${e.date}: ${e.score}점`}>
                  <div className="w-full rounded-t-md gradient-warm transition-all hover:opacity-80" style={{ height: `${(e.score / max) * 100}%` }} />
                  <div className="text-[8px] text-muted-foreground">{e.date.slice(8)}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-card rounded-3xl p-5 shadow-card border border-border/50">
          <h3 className="text-sm font-bold mb-2">💡 AI 가이드</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            <b className="text-foreground">{user.name}님</b>, 현재 <b>{user.skinType}</b> 피부에 <b>{user.concern}</b> 케어가 가장 시급합니다.
            평균 수면 <b>{user.sleep}</b>, 식단 <b>{user.diet}</b>을 유지하고 있어요.
            여드름 회복을 위해 7시간 이상 숙면과 충분한 수분 섭취를 권장합니다.
          </p>
        </div>

        <div className="bg-card rounded-3xl p-5 shadow-card border border-border/50">
          <h3 className="text-sm font-bold mb-3">🩺 신체 정보</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              ["BMI", user.bmi ?? "—"],
              ["나이", `${user.age}세`],
              ["키", `${user.height}cm`],
              ["몸무게", `${user.weight}kg`],
              ["스트레스", user.stress],
              ["운동", user.exercise],
            ].map(([k, v]) => (
              <div key={k as string} className="bg-secondary/50 rounded-xl p-3">
                <div className="text-[10px] text-muted-foreground">{k}</div>
                <div className="font-bold text-sm">{v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}