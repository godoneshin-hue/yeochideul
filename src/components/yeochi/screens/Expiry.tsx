import { useState } from "react";
import { useApp, todayStr } from "@/lib/yeochi-store";
import { Header } from "@/components/yeochi/Header";
import { Trash2, Plus } from "lucide-react";

export function ExpiryScreen() {
  const { user, setUser } = useApp();
  const [name, setName] = useState("");
  const [openDate, setOpenDate] = useState(todayStr());
  const [months, setMonths] = useState(12);

  const add = () => {
    if (!name) return;
    setUser((u) => ({ ...u, cosmetics: [...u.cosmetics, { id: crypto.randomUUID(), name, openDate, months }] }));
    setName("");
  };
  const del = (id: string) => setUser((u) => ({ ...u, cosmetics: u.cosmetics.filter((c) => c.id !== id) }));

  const calc = (open: string, m: number) => {
    const d = new Date(open); d.setMonth(d.getMonth() + m);
    const days = Math.ceil((d.getTime() - Date.now()) / 86400000);
    return { exp: d.toISOString().slice(0, 10), days };
  };

  return (
    <>
      <Header title="화장품 관리함" />
      <div className="p-5 animate-fade-in-up">
        <div className="bg-card rounded-2xl p-4 shadow-card border border-border/50 space-y-2 mb-4">
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="제품명"
            className="w-full px-4 py-2.5 rounded-xl bg-secondary text-sm outline-none focus:ring-2 focus:ring-primary" />
          <div className="grid grid-cols-2 gap-2">
            <input type="date" value={openDate} onChange={(e) => setOpenDate(e.target.value)}
              className="px-3 py-2.5 rounded-xl bg-secondary text-xs outline-none focus:ring-2 focus:ring-primary" />
            <input type="number" value={months} onChange={(e) => setMonths(+e.target.value)} placeholder="개월"
              className="px-3 py-2.5 rounded-xl bg-secondary text-xs outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <button onClick={add} className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-sm active:scale-95 transition flex items-center justify-center gap-1">
            <Plus className="w-4 h-4" /> 등록
          </button>
        </div>

        {user.cosmetics.length === 0 ? (
          <div className="text-center text-xs text-muted-foreground py-12">등록된 화장품이 없어요</div>
        ) : (
          <div className="space-y-2">
            {user.cosmetics.map((c) => {
              const { exp, days } = calc(c.openDate, c.months);
              const warn = days < 30;
              const over = days < 0;
              return (
                <div key={c.id} className="bg-card rounded-2xl p-4 shadow-card border border-border/50 flex items-center gap-3 animate-fade-in-up">
                  <div className={`w-1.5 h-12 rounded-full ${over ? "bg-destructive" : warn ? "bg-amber-400" : "bg-emerald-400"}`} />
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-sm truncate">{c.name}</div>
                    <div className="text-[11px] text-muted-foreground">개봉 {c.openDate} · 만료 {exp}</div>
                    <div className={`text-xs font-semibold mt-0.5 ${over ? "text-destructive" : warn ? "text-amber-600" : "text-emerald-600"}`}>
                      {over ? `만료 ${-days}일 지남` : `${days}일 남음`}
                    </div>
                  </div>
                  <button onClick={() => del(c.id)} className="p-2 rounded-full hover:bg-destructive/10 text-destructive active:scale-90 transition">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}