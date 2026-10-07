import { useState } from "react";
import { useApp, todayStr, addCosmetic, deleteCosmetic } from "@/lib/yeochi-store";
import { Header } from "@/components/yeochi/Header";
import { Card, PrimaryButton, SectionTitle, FieldLabel, inputClass } from "@/components/yeochi/ui";
import { Trash2 } from "lucide-react";

export function ExpiryScreen() {
  const { user, setUser } = useApp();
  const [name, setName] = useState("");
  const [openDate, setOpenDate] = useState(todayStr());
  const [months, setMonths] = useState(12);
  const [saving, setSaving] = useState(false);

  const add = async () => {
    if (!name) return;
    setSaving(true);
    try {
      const item = await addCosmetic(user.id, { name, openDate, months });
      setUser((u) => ({ ...u, cosmetics: [...u.cosmetics, item] }));
      setName("");
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };
  const del = async (id: string) => {
    setUser((u) => ({ ...u, cosmetics: u.cosmetics.filter((c) => c.id !== id) }));
    try {
      await deleteCosmetic(id);
    } catch (e) {
      console.error(e);
    }
  };

  const calc = (open: string, m: number) => {
    const d = new Date(open);
    d.setMonth(d.getMonth() + m);
    const days = Math.ceil((d.getTime() - Date.now()) / 86400000);
    return { exp: d.toISOString().slice(0, 10), days };
  };

  return (
    <>
      <Header title="화장품 관리함" />
      <div className="px-5 pt-2 pb-10 animate-fade-in-up">
        <Card className="p-4 space-y-3">
          <div>
            <FieldLabel>제품명</FieldLabel>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="예: 어성초 77 진정 토너"
              className={inputClass}
            />
          </div>
          <div className="grid grid-cols-[1fr_96px] gap-2">
            <div>
              <FieldLabel>개봉일</FieldLabel>
              <input
                type="date"
                value={openDate}
                onChange={(e) => setOpenDate(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <FieldLabel>사용 기한</FieldLabel>
              <div className="relative">
                <input
                  type="number"
                  value={months}
                  onChange={(e) => setMonths(+e.target.value)}
                  className={`${inputClass} pr-10 tabular-nums`}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[13px] text-muted-foreground">
                  개월
                </span>
              </div>
            </div>
          </div>
          <PrimaryButton onClick={add} disabled={saving || !name} className="!mt-4">
            {saving ? "등록 중..." : "등록하기"}
          </PrimaryButton>
        </Card>

        <div className="mt-8">
          <SectionTitle hint="남은 기간이 짧은 순으로 확인해보세요">
            내 화장품{" "}
            {user.cosmetics.length > 0 && (
              <span className="text-muted-foreground font-medium tabular-nums">
                {user.cosmetics.length}
              </span>
            )}
          </SectionTitle>
          {user.cosmetics.length === 0 ? (
            <div className="rounded-[20px] border border-dashed border-border py-12 text-center text-[14px] text-muted-foreground">
              등록된 화장품이 없어요
            </div>
          ) : (
            <Card className="divide-y divide-border overflow-hidden">
              {user.cosmetics
                .map((c) => ({ c, ...calc(c.openDate, c.months) }))
                .sort((a, b) => a.days - b.days)
                .map(({ c, exp, days }) => {
                  const warn = days < 30;
                  const over = days < 0;
                  return (
                    <div key={c.id} className="px-4 py-3.5 flex items-center gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="text-[15px] font-medium truncate">{c.name}</div>
                        <div className="text-[12px] text-muted-foreground tabular-nums mt-0.5">
                          개봉 {c.openDate.slice(2).replaceAll("-", ".")} · 만료{" "}
                          {exp.slice(2).replaceAll("-", ".")}
                        </div>
                      </div>
                      <span
                        className={`h-7 px-2.5 rounded-full text-[12px] font-semibold inline-flex items-center tabular-nums ${
                          over
                            ? "bg-destructive/10 text-destructive"
                            : warn
                              ? "bg-amber-100 text-amber-700"
                              : "bg-surface text-secondary-foreground"
                        }`}
                      >
                        {over ? `${-days}일 지남` : `D-${days}`}
                      </span>
                      <button
                        onClick={() => del(c.id)}
                        aria-label={`${c.name} 삭제`}
                        className="w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground active:bg-surface transition"
                      >
                        <Trash2 className="w-4 h-4" strokeWidth={1.75} />
                      </button>
                    </div>
                  );
                })}
            </Card>
          )}
        </div>
      </div>
    </>
  );
}
