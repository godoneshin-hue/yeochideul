import { useState } from "react";
import { useApp, fetchCurrentUser, signInUser } from "@/lib/yeochi-store";
import { PrimaryButton, inputClass } from "@/components/yeochi/ui";

export function LoginScreen() {
  const { setUser, go } = useApp();
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const [findPw, setFindPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!email || !pw) return setErr("이메일과 비밀번호를 입력해주세요.");
    setErr("");
    setLoading(true);
    try {
      await signInUser(email.trim(), pw);
      const user = await fetchCurrentUser();
      if (!user) throw new Error("로그인에 실패했습니다.");
      setUser(user);
      go(user.surveyDone ? "home" : "survey");
    } catch (e) {
      setErr(e instanceof Error ? e.message : "로그인에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-full flex flex-col px-6 pt-16 pb-8 animate-fade-in-up">
      <div className="mb-12">
        <div className="w-11 h-11 rounded-[14px] bg-primary flex items-center justify-center mb-6">
          <span className="text-primary-foreground text-[20px] font-extrabold tracking-[-0.05em]">
            여
          </span>
        </div>
        <h1 className="text-[28px] leading-[1.3] font-bold tracking-[-0.04em]">
          피부 기록을
          <br />
          가장 쉽게, 여치들
        </h1>
        <p className="text-[15px] text-muted-foreground mt-3">
          패치로 측정하고 나에게 맞는 케어를 찾아요
        </p>
      </div>

      <form
        className="space-y-3"
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
      >
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="이메일"
          type="email"
          autoComplete="email"
          className={inputClass}
        />
        <input
          type="password"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          placeholder="비밀번호"
          autoComplete="current-password"
          className={inputClass}
        />
        {err && <p className="text-[13px] text-destructive px-1">{err}</p>}

        <PrimaryButton type="submit" disabled={loading} className="!mt-5">
          {loading ? "로그인 중..." : "로그인"}
        </PrimaryButton>
      </form>

      <div className="flex items-center justify-center gap-3 mt-5 text-[14px] text-muted-foreground">
        <button onClick={() => go("signup")} className="font-medium text-foreground">
          회원가입
        </button>
        <span className="w-px h-3 bg-border" />
        <button onClick={() => setFindPw(true)}>비밀번호 찾기</button>
      </div>

      {findPw && (
        <div className="mt-4 p-4 rounded-[14px] bg-surface text-[13px] text-secondary-foreground animate-fade-in-up flex items-start justify-between gap-3">
          <span>가입하신 이메일로 임시 비밀번호가 발송됩니다. (데모)</span>
          <button
            onClick={() => setFindPw(false)}
            className="shrink-0 underline underline-offset-2"
          >
            닫기
          </button>
        </div>
      )}

      <div className="mt-auto pt-12 text-center text-[12px] text-muted-foreground/70">© 여치들</div>
    </div>
  );
}
