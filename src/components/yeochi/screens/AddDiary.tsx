import { useState } from "react";
import { useApp, todayStr, upsertDiaryEntry } from "@/lib/yeochi-store";
import { uploadUserPhoto } from "@/lib/supabase";
import { PRODUCT_LIST } from "@/lib/yeochi-data";
import { Header } from "@/components/yeochi/Header";
import { Upload, Check } from "lucide-react";

export function AddDiaryScreen() {
  const { user, setUser, go } = useApp();
  const [date, setDate] = useState(todayStr());
  const [img, setImg] = useState<string | undefined>();
  const [uploading, setUploading] = useState(false);
  const [desc, setDesc] = useState("");
  const [score, setScore] = useState(80);
  const [products, setProducts] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState(false);

  const onFile = async (f: File | null) => {
    if (!f) return;
    setUploading(true);
    try {
      const url = await uploadUserPhoto(user.id, f, "diary");
      setImg(url);
    } catch (e) {
      console.error(e);
    } finally {
      setUploading(false);
    }
  };

  const toggle = (p: string) =>
    setProducts((arr) => (arr.includes(p) ? arr.filter((x) => x !== p) : [...arr, p]));

  const save = async () => {
    const entry = { date, img, desc, score, products };
    setSaving(true);
    try {
      await upsertDiaryEntry(user.id, entry);
      setUser((u) => ({ ...u, diary: { ...u.diary, [date]: entry } }));
      go("calendar");
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const filtered = PRODUCT_LIST.filter((p) => p.toLowerCase().includes(search.toLowerCase())).slice(
    0,
    20,
  );

  return (
    <>
      <Header title="여드름 기록 추가" />
      <div className="p-5 space-y-4 animate-fade-in-up">
        <Section title="날짜">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-secondary text-sm outline-none focus:ring-2 focus:ring-primary"
          />
        </Section>

        <Section title="피부 사진">
          <label className="block">
            <input
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={(e) => onFile(e.target.files?.[0] || null)}
            />
            {img ? (
              <img src={img} className="w-full aspect-video object-cover rounded-2xl" alt="diary" />
            ) : (
              <div className="w-full aspect-video bg-secondary rounded-2xl flex flex-col items-center justify-center text-muted-foreground gap-2 border-2 border-dashed border-border active:scale-98 transition">
                <Upload className="w-6 h-6" />
                <span className="text-xs">{uploading ? "업로드 중..." : "탭하여 사진 추가"}</span>
              </div>
            )}
          </label>
        </Section>

        <Section title={`피부 점수: ${score}점`}>
          <input
            type="range"
            min={0}
            max={100}
            value={score}
            onChange={(e) => setScore(+e.target.value)}
            className="w-full accent-[var(--primary)]"
          />
        </Section>

        <Section title="짧은 메모">
          <textarea
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            placeholder="오늘 피부 상태는?"
            rows={3}
            className="w-full px-4 py-3 rounded-xl bg-secondary text-sm outline-none focus:ring-2 focus:ring-primary resize-none"
          />
        </Section>

        <Section title="사용한 제품">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="제품 검색..."
            className="w-full px-4 py-2.5 rounded-xl bg-secondary text-sm outline-none focus:ring-2 focus:ring-primary mb-2"
          />
          <div className="max-h-48 overflow-y-auto space-y-1 scrollbar-hide">
            {filtered.map((p) => {
              const on = products.includes(p);
              return (
                <button
                  key={p}
                  onClick={() => toggle(p)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between transition active:scale-98 ${on ? "bg-primary/15 text-primary font-semibold" : "bg-secondary/50 hover:bg-secondary"}`}
                >
                  <span className="truncate">{p}</span>
                  {on && <Check className="w-4 h-4 shrink-0" />}
                </button>
              );
            })}
          </div>
          {products.length > 0 && (
            <div className="mt-2 text-[11px] text-muted-foreground">{products.length}개 선택됨</div>
          )}
        </Section>

        <button
          onClick={save}
          disabled={saving || uploading}
          className="w-full py-4 rounded-2xl bg-primary text-primary-foreground font-bold shadow-soft active:scale-95 transition disabled:opacity-60"
        >
          {saving ? "저장 중..." : "기록 저장 →"}
        </button>
      </div>
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-card rounded-2xl p-4 shadow-card border border-border/50">
      <div className="text-xs font-bold mb-2.5">{title}</div>
      {children}
    </div>
  );
}
