import { useState } from "react";
import { useApp, updateProfile } from "@/lib/yeochi-store";
import {
  SURVEY_DIET,
  SURVEY_SLEEP,
  SKIN_TYPES,
  ACNE_CONCERNS,
  STRESS_LEVEL,
  WATER_INTAKE,
  EXERCISE_FREQ,
  MAKEUP_FREQ,
} from "@/lib/yeochi-data";
import { Heart } from "lucide-react";

export function SurveyScreen() {
  const { user, setUser, go } = useApp();
  const [age, setAge] = useState(user.age);
  const [gender, setGender] = useState(user.gender);
  const [height, setHeight] = useState(user.height);
  const [weight, setWeight] = useState(user.weight);
  const [skinType, setSkinType] = useState(user.skinType);
  const [concern, setConcern] = useState(user.concern);
  const [diet, setDiet] = useState(user.diet);
  const [sleep, setSleep] = useState(user.sleep);
  const [stress, setStress] = useState(user.stress);
  const [water, setWater] = useState(user.water);
  const [exercise, setExercise] = useState(user.exercise);
  const [makeup, setMakeup] = useState(user.makeup);
  const [heart, setHeart] = useState(0);
  const [celebrate, setCelebrate] = useState(false);
  const [saving, setSaving] = useState(false);

  const pop = () => setHeart((h) => h + 1);

  const submit = async () => {
    const bmi = +(weight / Math.pow(height / 100, 2)).toFixed(1);
    setSaving(true);
    try {
      await updateProfile(user.id, {
        age,
        gender,
        height,
        weight,
        skinType,
        concern,
        diet,
        sleep,
        stress,
        water,
        exercise,
        makeup,
        bmi,
        surveyDone: true,
      });
      setUser((u) => ({
        ...u,
        age,
        gender,
        height,
        weight,
        skinType,
        concern,
        diet,
        sleep,
        stress,
        water,
        exercise,
        makeup,
        bmi,
        surveyDone: true,
      }));
      setCelebrate(true);
      setTimeout(() => go("home"), 1200);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-full px-6 py-6 animate-fade-in-up relative">
      {celebrate && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {Array.from({ length: 18 }).map((_, i) => (
            <div
              key={i}
              className="absolute animate-float-up text-3xl"
              style={{
                left: `${Math.random() * 100}%`,
                bottom: 0,
                animationDelay: `${Math.random() * 0.4}s`,
              }}
            >
              {""}
            </div>
          ))}
        </div>
      )}

      <h2 className="text-2xl font-extrabold mb-1">정밀 여드름 진단</h2>
      <p className="text-xs text-muted-foreground mb-6">맞춤 솔루션을 위해 알려주세요</p>

      <Card title="신체 데이터" onTap={pop}>
        <Number label="나이" value={age} onChange={setAge} min={1} max={100} />
        <Choice
          label="성별"
          options={["여성", "남성", "기타"]}
          value={gender}
          onChange={setGender}
        />
        <Number label="키 (cm)" value={height} onChange={setHeight} min={100} max={220} />
        <Number label="몸무게 (kg)" value={weight} onChange={setWeight} min={30} max={150} />
      </Card>

      <Card title="라이프스타일" onTap={pop}>
        <Choice label="식단" options={SURVEY_DIET} value={diet} onChange={setDiet} small />
        <Choice label="평균 수면" options={SURVEY_SLEEP} value={sleep} onChange={setSleep} small />
        <Choice
          label="물 섭취량 (일)"
          options={WATER_INTAKE}
          value={water}
          onChange={setWater}
          small
        />
        <Choice
          label="운동 빈도"
          options={EXERCISE_FREQ}
          value={exercise}
          onChange={setExercise}
          small
        />
        <Choice label="스트레스" options={STRESS_LEVEL} value={stress} onChange={setStress} small />
        <Choice
          label="메이크업 빈도"
          options={MAKEUP_FREQ}
          value={makeup}
          onChange={setMakeup}
          small
        />
      </Card>

      <Card title="여드름 고민" onTap={pop}>
        <Choice
          label="피부 타입"
          options={SKIN_TYPES}
          value={skinType}
          onChange={setSkinType}
          small
        />
        <Choice
          label="가장 큰 고민"
          options={ACNE_CONCERNS}
          value={concern}
          onChange={setConcern}
          small
        />
      </Card>

      <button
        onClick={submit}
        disabled={saving}
        className="w-full py-4 mt-4 rounded-2xl bg-primary text-primary-foreground font-bold shadow-soft active:scale-95 transition disabled:opacity-60"
      >
        {saving ? "저장 중..." : "진단 완료 · 홈으로 →"}
      </button>

      {/* heart pops */}
      <div className="fixed inset-0 pointer-events-none">
        {Array.from({ length: heart })
          .slice(-3)
          .map((_, i) => (
            <Heart
              key={heart - i}
              className="absolute text-primary fill-primary animate-heart-pop"
              style={{ left: `${20 + Math.random() * 60}%`, top: `${30 + Math.random() * 30}%` }}
            />
          ))}
      </div>
    </div>
  );
}

function Card({
  title,
  children,
  onTap,
}: {
  title: string;
  children: React.ReactNode;
  onTap?: () => void;
}) {
  return (
    <div
      onClick={onTap}
      className="bg-card rounded-3xl p-5 mb-4 shadow-card border border-border/50 space-y-3"
    >
      <h3 className="font-bold text-sm">{title}</h3>
      {children}
    </div>
  );
}

function Number({
  label,
  value,
  onChange,
  min,
  max,
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
  min: number;
  max: number;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-muted-foreground">{label}</span>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onChange(Math.max(min, value - 1))}
          className="w-8 h-8 rounded-full bg-secondary active:scale-90 transition font-bold"
        >
          −
        </button>
        <span className="font-bold w-12 text-center">{value}</span>
        <button
          onClick={() => onChange(Math.min(max, value + 1))}
          className="w-8 h-8 rounded-full bg-primary text-primary-foreground active:scale-90 transition font-bold"
        >
          +
        </button>
      </div>
    </div>
  );
}

function Choice({
  label,
  options,
  value,
  onChange,
  small,
}: {
  label: string;
  options: readonly string[] | string[];
  value: string;
  onChange: (v: string) => void;
  small?: boolean;
}) {
  return (
    <div>
      <div className="text-xs text-muted-foreground mb-2">{label}</div>
      <div className="flex gap-2 flex-wrap">
        {options.map((o) => (
          <button
            key={o}
            onClick={() => onChange(o)}
            className={`px-4 ${small ? "py-1.5 text-xs" : "py-2 text-sm"} rounded-full transition active:scale-90 ${value === o ? "bg-primary text-primary-foreground shadow-soft" : "bg-secondary text-secondary-foreground"}`}
          >
            {o}
          </button>
        ))}
      </div>
    </div>
  );
}
