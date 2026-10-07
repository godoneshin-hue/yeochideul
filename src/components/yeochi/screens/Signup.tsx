import { useState } from "react";
import { useApp, fetchCurrentUser, signUpUser } from "@/lib/yeochi-store";
import { COLOR_PRESETS } from "@/lib/yeochi-data";
import { PrimaryButton, FieldLabel, inputClass } from "@/components/yeochi/ui";
import { ChevronLeft } from "lucide-react";

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
    <div className="min-h-full px-6 pb-10 animate-fade-in-up">
      <div className="h-14 -mx-4 flex items-center">
        <button
          onClick={() => go("login")}
          aria-label="로그인으로"
          className="w-10 h-10 flex items-center justify-center rounded-full active:bg-surface"
        >
          <ChevronLeft className="w-6 h-6" strokeWidth={1.75} />
        </button>
      </div>
      <h2 className="text-[24px] font-bold tracking-[-0.035em] mt-2">계정 만들기</h2>
      <p className="text-[15px] text-muted-foreground mt-1.5 mb-8">
        몇 가지만 입력하면 바로 시작할 수 있어요
      </p>

      <div className="space-y-5">
        <Field label="이름" value={name} onChange={setName} placeholder="이름" />
        <Field
          label="이메일"
          value={email}
          onChange={setEmail}
          placeholder="example@mail.com"
          type="email"
        />
        <Field
          label="비밀번호"
          value={pw}
          onChange={setPw}
          placeholder="8자 이상"
          type="password"
        />
        <Field
          label="비밀번호 확인"
          value={pw2}
          onChange={setPw2}
          placeholder="한 번 더 입력"
          type="password"
        />

        <div>
          <FieldLabel>테마 컬러</FieldLabel>
          <div className="flex gap-3 mt-1">
            {COLOR_PRESETS.map((c) => {
              const active = color === c && !customColor;
              return (
                <button
                  key={c}
                  onClick={() => {
                    setColor(c);
                    setCustomColor("");
                  }}
                  aria-label={`테마 컬러 ${c}`}
                  style={{ background: c }}
                  className={`w-10 h-10 rounded-full transition active:scale-90 ${active ? "ring-2 ring-offset-2 ring-offset-background ring-foreground" : ""}`}
                />
              );
            })}
          </div>
          <input
            value={customColor}
            onChange={(e) => setCustomColor(e.target.value)}
            placeholder="직접 입력 (예: #FF8C42)"
            className={`${inputClass} mt-3`}
          />
        </div>

        {err && <p className="text-[13px] text-destructive px-1">{err}</p>}
        {info && <p className="text-[13px] text-primary px-1">{info}</p>}

        <PrimaryButton onClick={submit} disabled={loading} className="!mt-8">
          {loading ? "가입 중..." : "가입하고 피부 진단 시작"}
        </PrimaryButton>
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
      <FieldLabel>{label}</FieldLabel>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={inputClass}
      />
    </div>
  );
}
