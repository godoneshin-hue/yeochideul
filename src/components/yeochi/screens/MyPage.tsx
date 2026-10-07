import { useState } from "react";
import {
  useApp,
  defaultUser,
  updateProfile,
  signOutUser,
  deleteOwnAccount,
} from "@/lib/yeochi-store";
import { uploadUserPhoto } from "@/lib/supabase";
import { COLOR_PRESETS, SKIN_TYPES } from "@/lib/yeochi-data";
import { Header } from "@/components/yeochi/Header";
import { Card, PrimaryButton, SectionTitle } from "@/components/yeochi/ui";
import { Camera, User, ChevronRight } from "lucide-react";

export function MyPageScreen() {
  const { user, setUser, go } = useApp();
  const [name, setName] = useState(user.name);
  const [age, setAge] = useState(user.age);
  const [gender, setGender] = useState(user.gender);
  const [height, setHeight] = useState(user.height);
  const [weight, setWeight] = useState(user.weight);
  const [skinType, setSkinType] = useState(user.skinType);
  const [color, setColor] = useState(user.themeColor);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploadingPic, setUploadingPic] = useState(false);
  const [confirmDel, setConfirmDel] = useState(false);

  const save = async () => {
    setSaving(true);
    try {
      await updateProfile(user.id, {
        name,
        age,
        gender,
        height,
        weight,
        skinType,
        themeColor: color,
      });
      setUser((u) => ({ ...u, name, age, gender, height, weight, skinType, themeColor: color }));
      setSaved(true);
      setTimeout(() => setSaved(false), 1500);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const onPic = async (f: File | null) => {
    if (!f) return;
    setUploadingPic(true);
    try {
      const url = await uploadUserPhoto(user.id, f, "profile");
      await updateProfile(user.id, { profilePic: url });
      setUser((p) => ({ ...p, profilePic: url }));
    } catch (e) {
      console.error(e);
    } finally {
      setUploadingPic(false);
    }
  };

  const logout = async () => {
    await signOutUser();
    setUser(defaultUser);
    go("login");
  };
  const remove = async () => {
    try {
      await deleteOwnAccount();
    } catch (e) {
      console.error(e);
    }
    setUser(defaultUser);
    go("login");
  };

  return (
    <>
      <Header title="마이페이지" />
      <div className="px-5 pt-2 pb-12 animate-fade-in-up">
        <div className="flex items-center gap-4 px-1">
          <label className="relative cursor-pointer shrink-0">
            <div className="w-[72px] h-[72px] rounded-full overflow-hidden bg-surface flex items-center justify-center">
              {user.profilePic ? (
                <img src={user.profilePic} alt="" className="w-full h-full object-cover" />
              ) : (
                <User className="w-8 h-8 text-muted-foreground" strokeWidth={1.5} />
              )}
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-7 h-7 rounded-full bg-card border border-border flex items-center justify-center">
              <Camera className="w-3.5 h-3.5" strokeWidth={1.75} />
            </div>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => onPic(e.target.files?.[0] || null)}
            />
          </label>
          <div className="min-w-0">
            <div className="text-[20px] font-bold tracking-[-0.03em]">{user.name}</div>
            <div className="text-[14px] text-muted-foreground truncate">{user.email}</div>
            {uploadingPic && (
              <div className="text-[12px] text-muted-foreground mt-0.5">사진 업로드 중...</div>
            )}
          </div>
        </div>

        <div className="mt-8">
          <SectionTitle>내 정보</SectionTitle>
          <Card className="divide-y divide-border overflow-hidden">
            <Row label="이름">
              <input value={name} onChange={(e) => setName(e.target.value)} className="row-input" />
            </Row>
            <Row label="나이">
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(+e.target.value)}
                className="row-input tabular-nums"
              />
            </Row>
            <Row label="성별">
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="row-input"
              >
                {["여성", "남성", "기타"].map((g) => (
                  <option key={g}>{g}</option>
                ))}
              </select>
            </Row>
            <Row label="키 (cm)">
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(+e.target.value)}
                className="row-input tabular-nums"
              />
            </Row>
            <Row label="몸무게 (kg)">
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(+e.target.value)}
                className="row-input tabular-nums"
              />
            </Row>
            <Row label="피부 타입">
              <select
                value={skinType}
                onChange={(e) => setSkinType(e.target.value)}
                className="row-input"
              >
                {SKIN_TYPES.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </Row>
          </Card>
        </div>

        <div className="mt-8">
          <SectionTitle>테마 컬러</SectionTitle>
          <Card className="p-4 flex gap-3 items-center">
            {COLOR_PRESETS.map((c) => (
              <button
                key={c}
                onClick={() => setColor(c)}
                aria-label={`테마 컬러 ${c}`}
                style={{ background: c }}
                className={`w-9 h-9 rounded-full transition active:scale-90 ${color === c ? "ring-2 ring-offset-2 ring-offset-card ring-foreground" : ""}`}
              />
            ))}
            <label className="w-9 h-9 rounded-full border border-dashed border-border flex items-center justify-center text-muted-foreground text-[18px] cursor-pointer relative overflow-hidden">
              +
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </label>
          </Card>
        </div>

        <PrimaryButton onClick={save} disabled={saving} className="mt-6">
          {saving ? "저장 중..." : saved ? "저장했어요" : "변경사항 저장"}
        </PrimaryButton>

        <Card className="mt-8 divide-y divide-border overflow-hidden">
          <button
            onClick={logout}
            className="w-full h-14 px-4 flex items-center justify-between text-[15px] active:bg-surface transition"
          >
            로그아웃
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </button>
          <button
            onClick={() => setConfirmDel(true)}
            className="w-full h-14 px-4 flex items-center justify-between text-[15px] text-muted-foreground active:bg-surface transition"
          >
            회원 탈퇴
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </button>
        </Card>

        {confirmDel && (
          <Card className="mt-3 p-4 animate-fade-in-up">
            <div className="text-[15px] font-semibold">정말 탈퇴하시겠어요?</div>
            <div className="text-[14px] text-muted-foreground mt-1">
              모든 기록이 삭제되고 되돌릴 수 없어요.
            </div>
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => setConfirmDel(false)}
                className="flex-1 h-11 rounded-[12px] bg-surface text-[14px] font-medium"
              >
                취소
              </button>
              <button
                onClick={remove}
                className="flex-1 h-11 rounded-[12px] bg-destructive text-white text-[14px] font-medium"
              >
                탈퇴하기
              </button>
            </div>
          </Card>
        )}
      </div>
      <style>{`.row-input{width:100%;text-align:right;background:transparent;font-size:15px;outline:none;padding:0;appearance:none}.row-input:focus{color:var(--primary)}`}</style>
    </>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 px-4 h-14">
      <span className="text-[15px] text-muted-foreground w-24 shrink-0">{label}</span>
      <div className="flex-1">{children}</div>
    </div>
  );
}
