import { useApp, todayStr } from "@/lib/yeochi-store";
import { Camera, Sparkles, Calendar, BarChart3, ShoppingBag, Package, User, Droplet, Moon, Plus } from "lucide-react";

export function HomeScreen() {
  const { user, setUser, go } = useApp();
  const today = todayStr();
  const habit = user.habits[today] || { date: today, water: 0, sleep: 0 };

  const addWater = () => {
    setUser((u) => ({ ...u, habits: { ...u.habits, [today]: { ...habit, water: habit.water + 1 } } }));
  };
  const setSleep = (v: number) => {
    setUser((u) => ({ ...u, habits: { ...u.habits, [today]: { ...habit, sleep: v } } }));
  };

  const features = [
    { icon: Camera, label: "패치 분석", color: "from-orange-400 to-pink-400", to: "analysis" as const },
    { icon: ShoppingBag, label: "제품추천", color: "from-amber-400 to-orange-500", to: "recommendation" as const },
    { icon: Calendar, label: "여드름 달력", color: "from-rose-400 to-orange-400", to: "calendar" as const },
    { icon: BarChart3, label: "분석 리포트", color: "from-yellow-400 to-orange-400", to: "report" as const },
    { icon: Package, label: "화장품 관리함", color: "from-pink-400 to-rose-400", to: "expiry" as const },
    { icon: User, label: "마이페이지", color: "from-orange-500 to-amber-500", to: "mypage" as const },
  ];

  return (
    <div className="pb-8 animate-fade-in-up">
      {/* Header */}
      <div
        className="px-6 pt-8 pb-6 text-primary-foreground rounded-b-[40px] shadow-soft"
        style={{ background: `linear-gradient(135deg, ${user.themeColor}, ${user.themeColor}cc)` }}
      >
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => go("mypage")} className="w-12 h-12 rounded-full bg-white/30 backdrop-blur overflow-hidden flex items-center justify-center text-xl ring-2 ring-white/50 active:scale-95 transition">
            {user.profilePic ? <img src={user.profilePic} alt="profile" className="w-full h-full object-cover" /> : <User className="w-6 h-6 text-white" />}
          </button>
          <div className="flex-1">
            <div className="text-xs opacity-90">안녕하세요</div>
            <div className="font-bold text-lg leading-tight">{user.name}님</div>
          </div>
        </div>
        <div className="bg-white/20 backdrop-blur rounded-2xl p-4">
          <div className="text-xs opacity-90 mb-1">오늘의 진단</div>
          <div className="font-bold text-sm leading-snug">
            {user.name}님은 <b>{user.skinType}</b> 피부타입이라<br />
            <b>{user.concern}</b> 케어가 필요해보여요!
          </div>
        </div>
      </div>

      {/* Health brief */}
      <div className="px-5 -mt-4">
        <div className="bg-card rounded-2xl p-4 shadow-card border border-border/50 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center text-lg" />
          <div className="flex-1">
            <div className="text-[11px] text-muted-foreground">오늘의 건강 브리핑</div>
            <div className="text-xs font-semibold">BMI {user.bmi ?? "—"} · 수면 {user.sleep} · {user.diet}</div>
          </div>
        </div>
      </div>

      {/* Habits */}
      <div className="px-5 mt-5">
        <h3 className="text-sm font-bold mb-3 px-1">오늘의 생활 습관 <span className="text-[10px] text-muted-foreground font-normal">· 달력에 자동 기록</span></h3>
        <div className="grid grid-cols-2 gap-3">
          <button onClick={addWater} className="bg-card rounded-2xl p-4 shadow-card border border-border/50 active:scale-95 transition text-left">
            <Droplet className="w-5 h-5 text-sky-500 mb-2" />
            <div className="text-[11px] text-muted-foreground">물 마시기</div>
            <div className="font-bold text-xl">{habit.water} <span className="text-xs font-normal text-muted-foreground">잔</span></div>
            <div className="text-[10px] text-primary mt-1 flex items-center gap-1"><Plus className="w-3 h-3" /> 한 잔 추가</div>
          </button>
          <div className="bg-card rounded-2xl p-4 shadow-card border border-border/50">
            <Moon className="w-5 h-5 text-indigo-500 mb-2" />
            <div className="text-[11px] text-muted-foreground">수면 시간</div>
            <input type="number" min={0} max={24} value={habit.sleep}
              onChange={(e) => setSleep(+e.target.value)}
              className="font-bold text-xl bg-transparent w-full outline-none" />
            <div className="text-[10px] text-muted-foreground">시간</div>
          </div>
        </div>
      </div>

      {/* Diary CTA */}
      <div className="px-5 mt-5">
        <button onClick={() => go("addDiary")}
          className="w-full bg-card rounded-2xl p-4 shadow-card border-2 border-dashed border-primary/40 flex items-center gap-3 active:scale-98 transition hover:bg-primary/5">
          <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
            <Plus className="w-5 h-5" />
          </div>
          <div className="text-left flex-1">
            <div className="font-bold text-sm">내 여드름 기록하기</div>
            <div className="text-[11px] text-muted-foreground">사진 · 사용 제품 · 메모 남기기</div>
          </div>
        </button>
      </div>

      {/* Patch analysis */}
      <div className="px-5 mt-6">
        <h3 className="text-sm font-bold mb-3 px-1">여드름 패치 정밀 분석</h3>
        <div className="relative bg-card rounded-3xl p-6 shadow-card border border-border/50 overflow-hidden">
          <div className="absolute inset-0 gradient-soft opacity-50" />
          <div className="relative flex flex-col items-center">
            <div className="relative w-40 h-40 rounded-full border-4 border-dashed border-primary/50 flex items-center justify-center my-2">
              <div className="absolute left-0 right-0 h-0.5 bg-primary/80 shadow-soft animate-scan rounded-full" style={{ top: "10%" }} />
              <Camera className="w-12 h-12 text-primary" />
            </div>
            <p className="text-xs text-muted-foreground text-center mt-3">패치를 부착한 부위를 원 안에 맞춰주세요</p>
            <button onClick={() => go("analysis")}
              className="mt-4 px-6 py-3 rounded-full bg-primary text-primary-foreground font-bold text-sm shadow-soft active:scale-95 transition flex items-center gap-2">
              <Sparkles className="w-4 h-4" /> 분석 시작하기
            </button>
          </div>
        </div>
      </div>

      {/* Features grid */}
      <div className="px-5 mt-6">
        <h3 className="text-sm font-bold mb-3 px-1">바로가기</h3>
        <div className="flex gap-3 overflow-x-auto scrollbar-hide -mx-5 px-5 pb-2">
          {features.map((f) => (
            <button key={f.label} onClick={() => go(f.to)}
              className={`shrink-0 w-24 aspect-square rounded-2xl bg-gradient-to-br ${f.color} text-white p-3 flex flex-col items-start justify-between shadow-card active:scale-95 transition animate-fade-in-up`}>
              <f.icon className="w-5 h-5" />
              <span className="font-bold text-xs text-left">{f.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}