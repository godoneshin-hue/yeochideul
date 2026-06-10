import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { AppCtx, defaultUser, Screen, User, saveAccount } from "@/lib/yeochi-store";
import { PhoneFrame } from "@/components/yeochi/PhoneFrame";
import { LoginScreen } from "@/components/yeochi/screens/Login";
import { SignupScreen } from "@/components/yeochi/screens/Signup";
import { SurveyScreen } from "@/components/yeochi/screens/Survey";
import { HomeScreen } from "@/components/yeochi/screens/Home";
import { CalendarScreen } from "@/components/yeochi/screens/Calendar";
import { ReportScreen } from "@/components/yeochi/screens/Report";
import { RecommendationScreen } from "@/components/yeochi/screens/Recommendation";
import { ExpiryScreen } from "@/components/yeochi/screens/Expiry";
import { AnalysisScreen } from "@/components/yeochi/screens/Analysis";
import { MyPageScreen } from "@/components/yeochi/screens/MyPage";
import { AddDiaryScreen } from "@/components/yeochi/screens/AddDiary";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "여치들 — 스마트 여드름 분석 파트너" },
      { name: "description", content: "여드름 패치로 측정하고, 맞춤 케어를 받아보세요." },
    ],
  }),
  component: Index,
});

function Index() {
  const [user, setUser] = useState<User>(() => {
    if (typeof window === "undefined") return defaultUser;
    try {
      const raw = localStorage.getItem("yeochi:user");
      return raw ? { ...defaultUser, ...JSON.parse(raw) } : defaultUser;
    } catch { return defaultUser; }
  });
  const [screen, setScreen] = useState<Screen>(() => {
    if (typeof window === "undefined") return "login";
    try {
      const raw = localStorage.getItem("yeochi:user");
      const u = raw ? JSON.parse(raw) : null;
      return u?.surveyDone ? "home" : "login";
    } catch { return "login"; }
  });
  const [history, setHistory] = useState<Screen[]>([]);

  useEffect(() => {
    try { localStorage.setItem("yeochi:user", JSON.stringify(user)); } catch {}
    if (user.email) saveAccount(user);
  }, [user]);

  useEffect(() => {
    document.documentElement.style.setProperty("--primary", oklchFromHex(user.themeColor));
    document.documentElement.style.setProperty("--ring", oklchFromHex(user.themeColor));
  }, [user.themeColor]);

  const ctx = useMemo(() => ({
    user,
    setUser,
    screen,
    go: (s: Screen) => { setHistory((h) => [...h, screen]); setScreen(s); },
    back: () => setHistory((h) => { const n = [...h]; const prev = n.pop(); if (prev) setScreen(prev); return n; }),
  }), [user, screen]);

  const Screens: Record<Screen, React.FC> = {
    login: LoginScreen,
    signup: SignupScreen,
    survey: SurveyScreen,
    home: HomeScreen,
    calendar: CalendarScreen,
    report: ReportScreen,
    recommendation: RecommendationScreen,
    expiry: ExpiryScreen,
    analysis: AnalysisScreen,
    mypage: MyPageScreen,
    addDiary: AddDiaryScreen,
  };
  const Current = Screens[screen];

  return (
    <AppCtx.Provider value={ctx}>
      <PhoneFrame>
        <div key={screen} className="animate-fade-in-up">
          <Current />
        </div>
      </PhoneFrame>
    </AppCtx.Provider>
  );
}

// minimal hex → oklch passthrough (browsers accept hex in oklch fallback if used as plain CSS color elsewhere)
// we set --primary to the raw hex; CSS color functions accept it.
function oklchFromHex(hex: string): string {
  return hex;
}
