import { useState } from "react";
import { useApp, todayStr, upsertDiaryEntry } from "@/lib/yeochi-store";
import { uploadUserPhoto } from "@/lib/supabase";
import { PRODUCT_LIST } from "@/lib/yeochi-data";
import { Header } from "@/components/yeochi/Header";
import { Card, PrimaryButton, inputClass } from "@/components/yeochi/ui";
import { ImagePlus, Check, Search } from "lucide-react";

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
      <Header title="피부 기록" />
      <div className="px-5 pt-2 pb-10 space-y-3 animate-fade-in-up">
        <Section title="날짜">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className={inputClass}
          />
        </Section>

        <Section title="피부 사진">
          <label className="block cursor-pointer">
            <input
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={(e) => onFile(e.target.files?.[0] || null)}
            />
            {img ? (
              <img src={img} className="w-full aspect-[4/3] object-cover rounded-[14px]" alt="" />
            ) : (
              <div className="w-full aspect-[4/3] bg-surface rounded-[14px] flex flex-col items-center justify-center text-muted-foreground gap-2">
                <ImagePlus className="w-6 h-6" strokeWidth={1.5} />
                <span className="text-[14px]">{uploading ? "업로드 중..." : "사진 추가"}</span>
              </div>
            )}
          </label>
        </Section>

        <Section
          title="피부 점수"
          right={
            <span className="text-[20px] font-bold tabular-nums text-primary">
              {score}
              <span className="text-[13px] font-medium text-muted-foreground">점</span>
            </span>
          }
        >
          <input
            type="range"
            min={0}
            max={100}
            value={score}
            onChange={(e) => setScore(+e.target.value)}
            className="w-full accent-[var(--primary)]"
          />
          <div className="flex justify-between text-[12px] text-muted-foreground mt-1">
            <span>안 좋음</span>
            <span>아주 좋음</span>
          </div>
        </Section>

        <Section title="메모">
          <textarea
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            placeholder="오늘 피부 상태를 남겨보세요"
            rows={3}
            className={`${inputClass} h-auto py-3 resize-none leading-relaxed`}
          />
        </Section>

        <Section
          title="사용한 제품"
          right={
            products.length > 0 ? (
              <span className="text-[13px] text-primary font-medium">{products.length}개 선택</span>
            ) : null
          }
        >
          <div className="relative mb-2">
            <Search className="w-4 h-4 text-muted-foreground absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="제품 검색"
              className={`${inputClass} pl-10`}
            />
          </div>
          <div className="max-h-56 overflow-y-auto scrollbar-hide -mx-1">
            {filtered.map((p) => {
              const on = products.includes(p);
              return (
                <button
                  key={p}
                  onClick={() => toggle(p)}
                  className="w-full text-left px-1 h-11 text-[14px] flex items-center justify-between gap-3 border-b border-border last:border-0"
                >
                  <span
                    className={`truncate ${on ? "text-foreground font-medium" : "text-secondary-foreground"}`}
                  >
                    {p}
                  </span>
                  <span
                    className={`w-5 h-5 rounded-full shrink-0 flex items-center justify-center border ${on ? "bg-primary border-primary text-primary-foreground" : "border-border"}`}
                  >
                    {on && <Check className="w-3 h-3" strokeWidth={3} />}
                  </span>
                </button>
              );
            })}
          </div>
        </Section>

        <PrimaryButton onClick={save} disabled={saving || uploading} className="!mt-6">
          {saving ? "저장 중..." : "기록 저장"}
        </PrimaryButton>
      </div>
    </>
  );
}

function Section({
  title,
  right,
  children,
}: {
  title: string;
  right?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="text-[15px] font-semibold">{title}</div>
        {right}
      </div>
      {children}
    </Card>
  );
}
