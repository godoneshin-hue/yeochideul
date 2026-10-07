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
import { PrimaryButton } from "@/components/yeochi/ui";

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
  const [saving, setSaving] = useState(false);

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
      go("home");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-full px-5 pt-8 pb-10 animate-fade-in-up">
      <div className="px-1 mb-8">
        <div className="text-[13px] font-semibold text-primary">피부 진단</div>
        <h2 className="text-[24px] leading-[1.35] font-bold tracking-[-0.035em] mt-1.5">
          맞춤 케어를 위해
          <br />몇 가지만 알려주세요
        </h2>
      </div>

      <Card step={1} title="신체 정보">
        <Number label="나이" value={age} onChange={setAge} min={1} max={100} unit="세" />
        <Choice
          label="성별"
          options={["여성", "남성", "기타"]}
          value={gender}
          onChange={setGender}
        />
        <Number label="키" value={height} onChange={setHeight} min={100} max={220} unit="cm" />
        <Number label="몸무게" value={weight} onChange={setWeight} min={30} max={150} unit="kg" />
      </Card>

      <Card step={2} title="피부 고민">
        <Choice label="피부 타입" options={SKIN_TYPES} value={skinType} onChange={setSkinType} />
        <Choice
          label="가장 큰 고민"
          options={ACNE_CONCERNS}
          value={concern}
          onChange={setConcern}
        />
      </Card>

      <Card step={3} title="생활 습관">
        <Choice label="식단" options={SURVEY_DIET} value={diet} onChange={setDiet} />
        <Choice label="평균 수면" options={SURVEY_SLEEP} value={sleep} onChange={setSleep} />
        <Choice label="하루 물 섭취량" options={WATER_INTAKE} value={water} onChange={setWater} />
        <Choice label="운동 빈도" options={EXERCISE_FREQ} value={exercise} onChange={setExercise} />
        <Choice label="스트레스" options={STRESS_LEVEL} value={stress} onChange={setStress} />
        <Choice label="메이크업 빈도" options={MAKEUP_FREQ} value={makeup} onChange={setMakeup} />
      </Card>

      <PrimaryButton onClick={submit} disabled={saving} className="mt-2">
        {saving ? "저장 중..." : "진단 완료"}
      </PrimaryButton>
    </div>
  );
}

function Card({
  step,
  title,
  children,
}: {
  step: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="bg-card rounded-[20px] border border-border p-5 mb-4">
      <div className="flex items-center gap-2 mb-5">
        <span className="w-6 h-6 rounded-full bg-foreground text-background text-[12px] font-semibold flex items-center justify-center tabular-nums">
          {step}
        </span>
        <h3 className="text-[17px] font-semibold tracking-[-0.02em]">{title}</h3>
      </div>
      <div className="space-y-6">{children}</div>
    </section>
  );
}

function Number({
  label,
  value,
  onChange,
  min,
  max,
  unit,
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
  min: number;
  max: number;
  unit: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[15px]">{label}</span>
      <div className="flex items-center h-10 rounded-full border border-border">
        <button
          onClick={() => onChange(Math.max(min, value - 1))}
          aria-label={`${label} 줄이기`}
          className="w-10 h-10 text-[18px] text-muted-foreground active:scale-90 transition"
        >
          −
        </button>
        <span className="min-w-14 text-center text-[15px] font-semibold tabular-nums">
          {value}
          <span className="text-[13px] font-normal text-muted-foreground ml-0.5">{unit}</span>
        </span>
        <button
          onClick={() => onChange(Math.min(max, value + 1))}
          aria-label={`${label} 늘리기`}
          className="w-10 h-10 text-[18px] text-muted-foreground active:scale-90 transition"
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
}: {
  label: string;
  options: readonly string[] | string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <div className="text-[13px] text-muted-foreground mb-2.5">{label}</div>
      <div className="flex gap-2 flex-wrap">
        {options.map((o) => (
          <button
            key={o}
            onClick={() => onChange(o)}
            className={`h-9 px-3.5 rounded-full text-[14px] border transition active:scale-95 ${
              value === o
                ? "bg-primary/10 border-primary text-primary font-semibold"
                : "bg-card border-border text-secondary-foreground"
            }`}
          >
            {o}
          </button>
        ))}
      </div>
    </div>
  );
}
