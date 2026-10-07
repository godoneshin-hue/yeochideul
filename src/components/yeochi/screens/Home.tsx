import { useApp, todayStr, upsertHabit } from "@/lib/yeochi-store";
import { Card, SectionTitle } from "@/components/yeochi/ui";
import {
  Calendar,
  BarChart3,
  ShoppingBag,
  Package,
  User,
  Droplet,
  Moon,
  Plus,
  Minus,
  ChevronRight,
  PenLine,
  ScanLine,
} from "lucide-react";

const WATER_GOAL = 8;

export function HomeScreen() {
  const { user, setUser, go } = useApp();
  const today = todayStr();
  const habit = user.habits[today] || { date: today, water: 0, sleep: 0 };

  const addWater = () => {
    const water = habit.water + 1;
    setUser((u) => ({ ...u, habits: { ...u.habits, [today]: { ...habit, water } } }));
    upsertHabit(user.id, today, { water }).catch((e) => console.error(e));
  };
  const setSleep = (v: number) => {
    const sleep = Math.max(0, Math.min(24, v));
    setUser((u) => ({ ...u, habits: { ...u.habits, [today]: { ...habit, sleep } } }));
    upsertHabit(user.id, today, { sleep }).catch((e) => console.error(e));
  };

  const menu = [
    {
      icon: ShoppingBag,
      label: "제품 추천",
      desc: "피부 타입 맞춤 제품",
      to: "recommendation" as const,
    },
    { icon: Calendar, label: "여드름 달력", desc: "날짜별 기록 모아보기", to: "calendar" as const },
    { icon: BarChart3, label: "분석 리포트", desc: "점수 변화와 가이드", to: "report" as const },
    { icon: Package, label: "화장품 관리함", desc: "개봉일 · 유통기한", to: "expiry" as const },
  ];

  const dateLabel = new Date().toLocaleDateString("ko-KR", {
    month: "long",
    day: "numeric",
    weekday: "short",
  });

  return (
    <div className="pb-10 animate-fade-in-up">
      {/* Top bar */}
      <div className="h-14 px-5 flex items-center justify-between">
        <span className="text-[19px] font-extrabold tracking-[-0.04em]">여치들</span>
        <button
          onClick={() => go("mypage")}
          aria-label="마이페이지"
          className="w-9 h-9 rounded-full bg-surface overflow-hidden flex items-center justify-center active:scale-95 transition"
        >
          {user.profilePic ? (
            <img src={user.profilePic} alt="" className="w-full h-full object-cover" />
          ) : (
            <User className="w-[18px] h-[18px] text-muted-foreground" strokeWidth={1.75} />
          )}
        </button>
      </div>

      {/* Greeting */}
      <div className="px-6 pt-3 pb-6">
        <div className="text-[13px] text-muted-foreground">{dateLabel}</div>
        <h1 className="text-[24px] leading-[1.35] font-bold tracking-[-0.035em] mt-1.5">
          {user.name}님, 오늘은
          <br />
          <span className="text-primary">{user.concern}</span> 케어에
          <br />
          집중해볼까요?
        </h1>
        <div className="flex gap-1.5 mt-4">
          <Tag>{user.skinType} 피부</Tag>
          <Tag>수면 {user.sleep}</Tag>
          <Tag>BMI {user.bmi ?? "—"}</Tag>
        </div>
      </div>

      {/* Patch analysis — the one primary action on this screen */}
      <div className="px-5">
        <button
          onClick={() => go("analysis")}
          className="w-full text-left rounded-[22px] bg-primary text-primary-foreground p-5 relative overflow-hidden active:scale-[0.99] transition"
        >
          <div className="absolute -right-8 -bottom-10 w-40 h-40 rounded-full border border-white/25" />
          <div className="absolute -right-2 -bottom-4 w-24 h-24 rounded-full border border-white/25" />
          <ScanLine className="w-6 h-6 mb-6" strokeWidth={1.75} />
          <div className="text-[18px] font-semibold tracking-[-0.02em]">패치 정밀 분석</div>
          <div className="text-[14px] opacity-85 mt-1">
            패치 부위를 찍으면 피부 상태를 알려드려요
          </div>
          <div className="mt-5 inline-flex items-center gap-1 h-9 px-4 rounded-full bg-white/95 text-foreground text-[14px] font-semibold">
            분석 시작 <ChevronRight className="w-4 h-4" />
          </div>
        </button>
      </div>

      {/* Habits */}
      <div className="px-5 mt-8">
        <SectionTitle hint="기록하면 달력에 자동으로 남아요">오늘의 생활 습관</SectionTitle>
        <div className="grid grid-cols-2 gap-3">
          <Card className="p-4">
            <div className="flex items-center gap-1.5 text-[13px] text-muted-foreground">
              <Droplet className="w-4 h-4 text-sky-500" strokeWidth={1.75} /> 물
            </div>
            <div className="mt-2 text-[26px] font-bold tabular-nums tracking-[-0.03em]">
              {habit.water}
              <span className="text-[14px] font-medium text-muted-foreground">
                {" "}
                / {WATER_GOAL}잔
              </span>
            </div>
            <div className="mt-2 h-1 rounded-full bg-surface overflow-hidden">
              <div
                className="h-full bg-sky-400 transition-all"
                style={{ width: `${Math.min(100, (habit.water / WATER_GOAL) * 100)}%` }}
              />
            </div>
            <button
              onClick={addWater}
              className="mt-3 w-full h-9 rounded-[10px] bg-surface text-[13px] font-medium flex items-center justify-center gap-1 active:scale-95 transition"
            >
              <Plus className="w-3.5 h-3.5" /> 한 잔
            </button>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-1.5 text-[13px] text-muted-foreground">
              <Moon className="w-4 h-4 text-indigo-500" strokeWidth={1.75} /> 수면
            </div>
            <div className="mt-2 text-[26px] font-bold tabular-nums tracking-[-0.03em]">
              {habit.sleep}
              <span className="text-[14px] font-medium text-muted-foreground"> 시간</span>
            </div>
            <div className="mt-2 h-1 rounded-full bg-surface overflow-hidden">
              <div
                className="h-full bg-indigo-400 transition-all"
                style={{ width: `${Math.min(100, (habit.sleep / 8) * 100)}%` }}
              />
            </div>
            <div className="mt-3 grid grid-cols-2 gap-1.5">
              <button
                onClick={() => setSleep(habit.sleep - 1)}
                aria-label="수면 1시간 빼기"
                className="h-9 rounded-[10px] bg-surface flex items-center justify-center active:scale-95 transition"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setSleep(habit.sleep + 1)}
                aria-label="수면 1시간 더하기"
                className="h-9 rounded-[10px] bg-surface flex items-center justify-center active:scale-95 transition"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </Card>
        </div>

        <button
          onClick={() => go("addDiary")}
          className="mt-3 w-full flex items-center gap-3 rounded-[20px] border border-border bg-card p-4 text-left active:bg-surface transition"
        >
          <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
            <PenLine className="w-[18px] h-[18px] text-primary" strokeWidth={1.75} />
          </div>
          <div className="flex-1">
            <div className="text-[15px] font-semibold">오늘 피부 기록하기</div>
            <div className="text-[13px] text-muted-foreground">사진 · 사용 제품 · 메모</div>
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground" strokeWidth={1.75} />
        </button>
      </div>

      {/* Menu */}
      <div className="px-5 mt-8">
        <SectionTitle>바로가기</SectionTitle>
        <Card className="divide-y divide-border overflow-hidden">
          {menu.map((m) => (
            <button
              key={m.label}
              onClick={() => go(m.to)}
              className="w-full flex items-center gap-3.5 px-4 h-[64px] text-left active:bg-surface transition"
            >
              <m.icon className="w-5 h-5 text-foreground/70" strokeWidth={1.6} />
              <div className="flex-1">
                <div className="text-[15px] font-medium">{m.label}</div>
                <div className="text-[12px] text-muted-foreground">{m.desc}</div>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" strokeWidth={1.75} />
            </button>
          ))}
        </Card>
      </div>
    </div>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="h-7 px-2.5 rounded-full bg-surface text-[12px] font-medium text-secondary-foreground inline-flex items-center">
      {children}
    </span>
  );
}
