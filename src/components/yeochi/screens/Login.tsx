import { useState } from "react";
import { useApp, defaultUser } from "@/lib/yeochi-store";

export function LoginScreen() {
  const { user, setUser, go } = useApp();
  const [name, setName] = useState("");
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const [findPw, setFindPw] = useState(false);

  const submit = () => {
    if (!name || !pw) return setErr("이름과 비밀번호를 입력해주세요.");
    setUser((u) => ({ ...u, name: u.name || name }));
    if (user.surveyDone) go("home");
    else go("survey");
  };

  return (
    <div className="min-h-full flex flex-col px-7 py-12 animate-fade-in-up">
      <div className="text-center mt-8 mb-12">
        <div className="text-6xl mb-3 animate-pop">🍊</div>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">여치들</h1>
        <p className="text-sm text-muted-foreground mt-2">스마트한 여드름 분석 파트너</p>
      </div>

      <div className="space-y-3">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="이름"
          className="w-full px-5 py-4 rounded-2xl bg-secondary border border-transparent focus:border-primary focus:outline-none transition text-sm"
        />
        <input
          type="password"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          placeholder="비밀번호"
          className="w-full px-5 py-4 rounded-2xl bg-secondary border border-transparent focus:border-primary focus:outline-none transition text-sm"
        />
        {err && <p className="text-xs text-destructive px-2">{err}</p>}

        <button
          onClick={submit}
          className="w-full py-4 rounded-2xl bg-primary text-primary-foreground font-bold shadow-soft active:scale-95 transition hover:opacity-95"
        >
          로그인
        </button>
      </div>

      <div className="flex items-center justify-center gap-4 mt-6 text-xs text-muted-foreground">
        <button onClick={() => go("signup")} className="hover:text-primary transition">회원가입</button>
        <span>·</span>
        <button onClick={() => setFindPw(true)} className="hover:text-primary transition">비밀번호 찾기</button>
      </div>

      {findPw && (
        <div className="mt-4 p-4 rounded-2xl bg-accent/50 text-xs text-accent-foreground animate-fade-in-up">
          가입하신 이메일로 임시 비밀번호가 발송됩니다. (데모)
          <button onClick={() => setFindPw(false)} className="ml-2 underline">닫기</button>
        </div>
      )}

      <div className="mt-auto pt-12 text-center text-[10px] text-muted-foreground/60">
        © 여치들 · 여드름은 더 이상 고민이 아니에요
      </div>

      <button
        onClick={() => { setUser({ ...defaultUser, name: "데모유저", surveyDone: false }); go("signup"); }}
        className="text-[10px] text-muted-foreground/40 mt-2"
      >
        (데모 리셋)
      </button>
    </div>
  );
}