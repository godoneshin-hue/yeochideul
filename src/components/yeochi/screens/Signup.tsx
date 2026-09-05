import { useState } from "react";
import { useApp, fetchCurrentUser, signUpUser } from "@/lib/yeochi-store";
import { COLOR_PRESETS } from "@/lib/yeochi-data";

export function SignupScreen() {
  const { setUser, go } = useApp();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [color, setColor] = useState(COLOR_PRESETS[0]);
  const [customColor, setCustomColor] = useState("");
  const [err, setErr] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!name || !email || !pw) return setErr("필수 정보를 입력해주세요.");
    if (pw !== pw2) return setErr("비밀번호가 일치하지 않습니다.");
    setErr("");
    setLoading(true);
    const finalColor = /^#[0-9a-fA-F]{6}$/.test(customColor) ? customColor : color;
    try {
      const { hasSession } = await signUpUser(email.trim(), pw, name, finalColor);
      if (!hasSession) {
        setInfo("가입 확인 이메일을 보냈어요. 이메일을 확인한 뒤 로그인해주세요.");
        return;
      }
      const user = await fetchCurrentUser();
      if (!user) throw new Error("회원가입에 실패했습니다.");
      setUser(user);
      go("survey");
    } catch (e) {
      setErr(e instanceof Error ? e.message : "회원가입에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-full px-6 py-6 animate-fade-in-up">
      <button
        onClick={() => go("login")}
        className="text-xs text-muted-foreground mb-4 hover:text-primary"
      >
        ← 로그인으로
      </button>
      <h2 className="text-2xl font-extrabold mb-1">환영해요!</h2>
      <p className="text-xs text-muted-foreground mb-6">여치들과 함께 시작해요</p>

      <div className="space-y-3">
        <Field label="이름 *" value={name} onChange={setName} placeholder="실명" />
        <Field label="이메일 *" value={email} onChange={setEmail} placeholder="example@mail.com" />
        <Field
          label="비밀번호 *"
          value={pw}
          onChange={setPw}
          placeholder="8자 이상"
          type="password"
        />
        <Field
          label="비밀번호 재확인 *"
          value={pw2}
          onChange={setPw2}
          placeholder="다시 입력"
          type="password"
        />

        <div>
          <label className="text-xs font-semibold text-muted-foreground px-1">테마 컬러</label>
          <div className="flex gap-2 mt-2 flex-wrap">
            {COLOR_PRESETS.map((c) => (
              <button
                key={c}
                onClick={() => {
                  setColor(c);
                  setCustomColor("");
                }}
                style={{ background: c }}
                className={`w-12 h-12 rounded-2xl transition active:scale-90 ${color === c && !customColor ? "ring-4 ring-offset-2 ring-foreground/30 scale-110" : ""}`}
              />
            ))}
          </div>
          <input
            value={customColor}
            onChange={(e) => setCustomColor(e.target.value)}
            placeholder="#FF8C42 (직접 입력)"
            className="mt-2 w-full px-4 py-3 rounded-xl bg-secondary text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <div className="mt-2 flex items-center gap-2 text-xs">
            <span>현재 컬러:</span>
            <span
              className="w-6 h-6 rounded-full border border-border"
              style={{ background: /^#[0-9a-fA-F]{6}$/.test(customColor) ? customColor : color }}
            />
          </div>
        </div>

        {err && <p className="text-xs text-destructive">{err}</p>}
        {info && <p className="text-xs text-primary">{info}</p>}

        <button
          onClick={submit}
          disabled={loading}
          className="w-full py-4 mt-4 rounded-2xl bg-primary text-primary-foreground font-bold shadow-soft active:scale-95 transition disabled:opacity-60"
        >
          {loading ? "가입 중..." : "가입하고 피부 진단 시작"}
        </button>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div>
      <label className="text-xs font-semibold text-muted-foreground px-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-1.5 w-full px-4 py-3 rounded-xl bg-secondary text-sm focus:outline-none focus:ring-2 focus:ring-primary transition"
      />
    </div>
  );
}
