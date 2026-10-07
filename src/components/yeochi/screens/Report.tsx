import { useApp } from "@/lib/yeochi-store";
import { Header } from "@/components/yeochi/Header";
import { Card, SectionTitle } from "@/components/yeochi/ui";

export function ReportScreen() {
  const { user } = useApp();
  const entries = Object.values(user.diary).sort((a, b) => a.date.localeCompare(b.date));
  const avg = entries.length
    ? Math.round(entries.reduce((s, e) => s + e.score, 0) / entries.length)
    : 0;
  const recent = entries.slice(-14);

  return (
    <>
      <Header title="분석 리포트" />
      <div className="px-5 pt-2 pb-10 animate-fade-in-up">
        <div className="px-1">
          <div className="text-[13px] text-muted-foreground">
            평균 피부 점수 · {entries.length}일 기록
          </div>
          <div className="text-[44px] leading-none font-bold tracking-[-0.04em] tabular-nums mt-2">
            {avg}
            <span className="text-[16px] font-medium text-muted-foreground ml-1">점</span>
          </div>
        </div>

        <div className="mt-8">
          <SectionTitle hint="최근 14일">점수 변화</SectionTitle>
          <Card className="p-5">
            {recent.length === 0 ? (
              <p className="text-[14px] text-muted-foreground text-center py-8">
                피부 기록을 남기면 그래프가 표시돼요
              </p>
            ) : (
              <div className="flex items-end gap-1.5 h-36">
                {recent.map((e, i) => (
                  <div
                    key={e.date}
                    className="flex-1 h-full flex flex-col items-center justify-end gap-1.5"
                    title={`${e.date}: ${e.score}점`}
                  >
                    <div
                      className={`w-full max-w-5 rounded-full ${i === recent.length - 1 ? "bg-primary" : "bg-primary/25"}`}
                      style={{ height: `${Math.max(4, e.score)}%` }}
                    />
                    <div className="text-[11px] text-muted-foreground tabular-nums">
                      {+e.date.slice(8)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        <div className="mt-8">
          <SectionTitle>케어 가이드</SectionTitle>
          <Card className="p-5">
            <p className="text-[15px] leading-[1.7] text-secondary-foreground">
              <b className="text-foreground font-semibold">{user.name}님</b>은{" "}
              <b className="text-foreground font-semibold">{user.skinType}</b> 피부로, 지금은{" "}
              <b className="text-primary font-semibold">{user.concern}</b> 케어가 가장 필요해요.
              평균 수면 {user.sleep}, 식단은 {user.diet}이에요. 회복을 위해 7시간 이상 숙면과 충분한
              수분 섭취를 권장해요.
            </p>
          </Card>
        </div>

        <div className="mt-8">
          <SectionTitle>신체 정보</SectionTitle>
          <Card className="grid grid-cols-3 divide-x divide-border">
            {[
              ["BMI", user.bmi ?? "—"],
              ["나이", `${user.age}세`],
              ["키", `${user.height}cm`],
            ].map(([k, v]) => (
              <Stat key={k as string} k={k as string} v={v as string} />
            ))}
          </Card>
          <Card className="grid grid-cols-3 divide-x divide-border mt-3">
            {[
              ["몸무게", `${user.weight}kg`],
              ["스트레스", user.stress],
              ["운동", user.exercise],
            ].map(([k, v]) => (
              <Stat key={k as string} k={k as string} v={v as string} />
            ))}
          </Card>
        </div>
      </div>
    </>
  );
}

function Stat({ k, v }: { k: string; v: string }) {
  return (
    <div className="py-4 text-center">
      <div className="text-[12px] text-muted-foreground">{k}</div>
      <div className="text-[15px] font-semibold mt-1 tabular-nums">{v}</div>
    </div>
  );
}
