import { useState } from "react";
import { useApp, fileToDataUrl, defaultUser } from "@/lib/yeochi-store";
import { COLOR_PRESETS, SKIN_TYPES } from "@/lib/yeochi-data";
import { Header } from "@/components/yeochi/Header";
import { LogOut, UserX, Upload, User } from "lucide-react";

export function MyPageScreen() {
  const { user, setUser, go } = useApp();
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [age, setAge] = useState(user.age);
  const [gender, setGender] = useState(user.gender);
  const [height, setHeight] = useState(user.height);
  const [weight, setWeight] = useState(user.weight);
  const [skinType, setSkinType] = useState(user.skinType);
  const [color, setColor] = useState(user.themeColor);
  const [emoji, setEmoji] = useState(user.emoji || "🍊");
  const [saved, setSaved] = useState(false);
  const [confirmDel, setConfirmDel] = useState(false);

  const save = () => {
    setUser((u) => ({ ...u, name, email, age, gender, height, weight, skinType, themeColor: color, emoji }));
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  const onPic = async (f: File | null) => {
    if (!f) return;
    const u = await fileToDataUrl(f);
    setUser((p) => ({ ...p, profilePic: u }));
  };

  const logout = () => { setUser(defaultUser); go("login"); };
  const remove = () => { setUser(defaultUser); go("login"); };

  return (
    <>
      <Header title="마이페이지" />
      <div className="p-5 space-y-4 animate-fade-in-up pb-12">
        <div className="bg-card rounded-3xl p-5 shadow-card border border-border/50 flex flex-col items-center">
          <label className="relative cursor-pointer">
            <div className="w-24 h-24 rounded-full overflow-hidden gradient-warm flex items-center justify-center text-3xl text-white ring-4 ring-primary/20">
              {user.profilePic ? <img src={user.profilePic} alt="me" className="w-full h-full object-cover" /> : "👤"}
            </div>
            <div className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-soft">
              <Upload className="w-4 h-4" />
            </div>
            <input type="file" accept="image/*" className="hidden" onChange={(e) => onPic(e.target.files?.[0] || null)} />
          </label>
          <div className="font-bold mt-3">{user.name}</div>
          <div className="text-xs text-muted-foreground">{user.email}</div>
        </div>

        <Section title="👤 개인 정보">
          <Row label="이름"><input value={name} onChange={(e) => setName(e.target.value)} className="input" /></Row>
          <Row label="이메일"><input value={email} onChange={(e) => setEmail(e.target.value)} className="input" /></Row>
          <Row label="나이"><input type="number" value={age} onChange={(e) => setAge(+e.target.value)} className="input" /></Row>
          <Row label="성별">
            <select value={gender} onChange={(e) => setGender(e.target.value)} className="input">
              {["여성", "남성", "기타"].map((g) => <option key={g}>{g}</option>)}
            </select>
          </Row>
          <Row label="키 (cm)"><input type="number" value={height} onChange={(e) => setHeight(+e.target.value)} className="input" /></Row>
          <Row label="몸무게 (kg)"><input type="number" value={weight} onChange={(e) => setWeight(+e.target.value)} className="input" /></Row>
          <Row label="피부 타입">
            <select value={skinType} onChange={(e) => setSkinType(e.target.value)} className="input">
              {SKIN_TYPES.map((s) => <option key={s}>{s}</option>)}
            </select>
          </Row>
        </Section>

        <Section title="🎨 테마 컬러">
          <div className="flex gap-2 flex-wrap">
            {COLOR_PRESETS.map((c) => (
              <button key={c} onClick={() => setColor(c)} style={{ background: c }}
                className={`w-10 h-10 rounded-2xl transition active:scale-90 ${color === c ? "ring-4 ring-offset-2 ring-foreground/30" : ""}`} />
            ))}
            <input type="color" value={color} onChange={(e) => setColor(e.target.value)}
              className="w-10 h-10 rounded-2xl cursor-pointer" />
          </div>
        </Section>

        <Section title="😊 대표 이모티콘">
          <div className="flex gap-2 flex-wrap">
            {EMOJI_PRESETS.map((e) => (
              <button key={e} onClick={() => setEmoji(e)}
                className={`w-11 h-11 rounded-2xl text-2xl flex items-center justify-center transition active:scale-90 ${emoji === e ? "bg-primary/15 ring-2 ring-primary" : "bg-secondary"}`}>
                {e}
              </button>
            ))}
            <input value={emoji} onChange={(e) => setEmoji(e.target.value.slice(0, 4))}
              placeholder="직접 입력"
              className="px-3 rounded-2xl bg-secondary text-sm w-28 outline-none focus:ring-2 focus:ring-primary" />
          </div>
        </Section>

        <button onClick={save}
          className="w-full py-3.5 rounded-2xl bg-primary text-primary-foreground font-bold shadow-soft active:scale-95 transition">
          {saved ? "✓ 저장 완료!" : "변경사항 저장"}
        </button>

        <div className="grid grid-cols-2 gap-2 pt-2">
          <button onClick={logout} className="py-3 rounded-2xl bg-secondary text-secondary-foreground font-semibold text-sm flex items-center justify-center gap-2 active:scale-95 transition">
            <LogOut className="w-4 h-4" /> 로그아웃
          </button>
          <button onClick={() => setConfirmDel(true)} className="py-3 rounded-2xl bg-destructive/10 text-destructive font-semibold text-sm flex items-center justify-center gap-2 active:scale-95 transition">
            <UserX className="w-4 h-4" /> 회원 탈퇴
          </button>
        </div>

        {confirmDel && (
          <div className="bg-destructive/5 border border-destructive/30 rounded-2xl p-4 animate-fade-in-up">
            <div className="text-xs font-semibold text-destructive mb-2">정말 탈퇴하시겠어요? 모든 기록이 삭제됩니다.</div>
            <div className="flex gap-2">
              <button onClick={() => setConfirmDel(false)} className="flex-1 py-2 rounded-xl bg-secondary text-xs font-semibold">취소</button>
              <button onClick={remove} className="flex-1 py-2 rounded-xl bg-destructive text-white text-xs font-semibold">탈퇴하기</button>
            </div>
          </div>
        )}
      </div>
      <style>{`.input{width:100%;padding:8px 12px;border-radius:10px;background:var(--secondary);font-size:13px;outline:none}.input:focus{box-shadow:0 0 0 2px var(--primary)}`}</style>
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-card rounded-2xl p-4 shadow-card border border-border/50 space-y-2.5">
      <h3 className="text-sm font-bold">{title}</h3>
      {children}
    </div>
  );
}
function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-muted-foreground w-20 shrink-0">{label}</span>
      <div className="flex-1">{children}</div>
    </div>
  );
}