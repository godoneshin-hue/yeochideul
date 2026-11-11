import { createContext, useContext } from "react";
import { supabase } from "./supabase";

export type DiaryRecord = {
  date: string; // YYYY-MM-DD
  img?: string; // signed Supabase Storage URL
  desc?: string;
  products: string[];
  score: number;
};

export type HabitRecord = {
  date: string;
  water: number;
  sleep: number;
};

export type CosmeticItem = {
  id: string;
  name: string;
  openDate: string;
  months: number;
};

export type GalleryItem = {
  id: string;
  img: string;
  size: number;
};

export type User = {
  id: string;
  name: string;
  email: string;
  emoji: string;
  themeColor: string;
  age: number;
  gender: string;
  height: number;
  weight: number;
  skinType: string;
  concern: string;
  diet: string;
  sleep: string;
  stress: string;
  water: string;
  exercise: string;
  makeup: string;
  surveyDone: boolean;
  profilePic?: string;
  bmi?: number;
  diary: Record<string, DiaryRecord>;
  habits: Record<string, HabitRecord>;
  cosmetics: CosmeticItem[];
  gallery: GalleryItem[];
};

export type Screen =
  | "login"
  | "signup"
  | "survey"
  | "home"
  | "calendar"
  | "report"
  | "recommendation"
  | "expiry"
  | "mypage"
  | "analysis"
  | "addDiary";

export const defaultUser: User = {
  id: "",
  name: "",
  email: "",
  emoji: "",
  themeColor: "#FF8C42",
  age: 25,
  gender: "여성",
  height: 165,
  weight: 55,
  skinType: "건성",
  concern: "좁쌀 여드름",
  diet: "한식 위주",
  sleep: "7시간",
  stress: "보통",
  water: "4-6잔",
  exercise: "주 1-2회",
  makeup: "주 2-3회",
  surveyDone: false,
  diary: {},
  habits: {},
  cosmetics: [],
  gallery: [],
};

type Ctx = {
  user: User;
  setUser: (u: User | ((prev: User) => User)) => void;
  screen: Screen;
  go: (s: Screen) => void;
  back: () => void;
};

export const AppCtx = createContext<Ctx | null>(null);
export const useApp = () => {
  const v = useContext(AppCtx);
  if (!v) throw new Error("AppCtx missing");
  return v;
};

export const todayStr = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

export const fileToDataUrl = (file: File): Promise<string> =>
  new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(r.result as string);
    r.onerror = rej;
    r.readAsDataURL(file);
  });

// ---------- Supabase-backed auth & data access ----------

type ProfileRow = {
  id: string;
  name: string;
  emoji: string;
  theme_color: string;
  age: number;
  gender: string;
  height: number;
  weight: number;
  skin_type: string;
  concern: string;
  diet: string;
  sleep: string;
  stress: string;
  water: string;
  exercise: string;
  makeup: string;
  survey_done: boolean;
  profile_pic_path: string | null;
  bmi: number | null;
};

function profileRowToUser(
  row: ProfileRow,
  email: string,
): Omit<User, "diary" | "habits" | "cosmetics" | "gallery"> {
  return {
    id: row.id,
    email,
    name: row.name,
    emoji: row.emoji,
    themeColor: row.theme_color,
    age: row.age,
    gender: row.gender,
    height: row.height,
    weight: row.weight,
    skinType: row.skin_type,
    concern: row.concern,
    diet: row.diet,
    sleep: row.sleep,
    stress: row.stress,
    water: row.water,
    exercise: row.exercise,
    makeup: row.makeup,
    surveyDone: row.survey_done,
    profilePic: row.profile_pic_path ?? undefined,
    bmi: row.bmi ?? undefined,
  };
}

// --- Demo login -------------------------------------------------------------
// One hard-coded account that skips Supabase entirely so the team can open the
// app even when the backend is unavailable. Its data lives only in this
// browser's localStorage. Intentionally insecure: the password ships in the
// client bundle.
const DEMO_EMAILS = ["juwonshin10@gmail.com", "juwonshin10@gmail"];
const DEMO_PASSWORD = "Enhypen1130!";
const DEMO_FLAG_KEY = "yeochi-demo";
const DEMO_USER_KEY = "yeochi-demo-user";
export const DEMO_USER_ID = "demo";

function isDemoCredentials(email: string, password: string): boolean {
  return DEMO_EMAILS.includes(email.trim().toLowerCase()) && password === DEMO_PASSWORD;
}

function demoActive(): boolean {
  try {
    return typeof window !== "undefined" && localStorage.getItem(DEMO_FLAG_KEY) === "1";
  } catch {
    return false;
  }
}

function loadDemoUser(): User {
  try {
    const raw = localStorage.getItem(DEMO_USER_KEY);
    if (raw) return JSON.parse(raw) as User;
  } catch {
    // fall through to a fresh demo user
  }
  return { ...defaultUser, id: DEMO_USER_ID, name: "주원", email: DEMO_EMAILS[0] };
}

function saveDemoUser(mutate: (u: User) => User): void {
  try {
    localStorage.setItem(DEMO_USER_KEY, JSON.stringify(mutate(loadDemoUser())));
  } catch {
    // storage unavailable: demo still works for this page view
  }
}

function startDemo(): void {
  try {
    localStorage.setItem(DEMO_FLAG_KEY, "1");
  } catch {
    // ignore
  }
}

function endDemo(): void {
  try {
    localStorage.removeItem(DEMO_FLAG_KEY);
  } catch {
    // ignore
  }
}

// Returns the full app User for the currently authenticated Supabase session,
// or null if nobody is signed in.
export async function fetchCurrentUser(): Promise<User | null> {
  if (demoActive()) return loadDemoUser();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session?.user) return null;
  const authUser = session.user;

  const [profileRes, diaryRes, habitsRes, cosmeticsRes] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", authUser.id).single(),
    supabase.from("diary_entries").select("*").eq("user_id", authUser.id),
    supabase.from("habits").select("*").eq("user_id", authUser.id),
    supabase.from("cosmetics").select("*").eq("user_id", authUser.id).order("created_at"),
  ]);
  if (profileRes.error || !profileRes.data) {
    throw profileRes.error ?? new Error("Profile not found");
  }

  const diary: Record<string, DiaryRecord> = {};
  for (const r of diaryRes.data ?? []) {
    diary[r.entry_date] = {
      date: r.entry_date,
      img: r.img_path ?? undefined,
      desc: r.description ?? "",
      products: r.products ?? [],
      score: r.score,
    };
  }

  const habits: Record<string, HabitRecord> = {};
  for (const r of habitsRes.data ?? []) {
    habits[r.entry_date] = { date: r.entry_date, water: r.water, sleep: Number(r.sleep) };
  }

  const cosmetics: CosmeticItem[] = (cosmeticsRes.data ?? []).map((r) => ({
    id: r.id,
    name: r.name,
    openDate: r.open_date,
    months: r.months,
  }));

  return {
    ...profileRowToUser(profileRes.data as ProfileRow, authUser.email ?? ""),
    diary,
    habits,
    cosmetics,
    gallery: [],
  };
}

export async function signUpUser(
  email: string,
  password: string,
  name: string,
  themeColor: string,
): Promise<{ hasSession: boolean }> {
  if (isDemoCredentials(email, password)) {
    startDemo();
    saveDemoUser((u) => ({ ...u, name: name || u.name, themeColor }));
    return { hasSession: true };
  }
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { name } },
  });
  if (error) throw error;
  if (!data.user) throw new Error("회원가입에 실패했습니다.");

  if (data.session) {
    const { error: updateErr } = await supabase
      .from("profiles")
      .update({ name, theme_color: themeColor })
      .eq("id", data.user.id);
    if (updateErr) throw updateErr;
  }
  return { hasSession: Boolean(data.session) };
}

export async function signInUser(email: string, password: string): Promise<void> {
  if (isDemoCredentials(email, password)) {
    startDemo();
    return;
  }
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
}

export async function signOutUser(): Promise<void> {
  if (demoActive()) return endDemo();
  await supabase.auth.signOut();
}

export async function deleteOwnAccount(): Promise<void> {
  if (demoActive()) {
    endDemo();
    localStorage.removeItem(DEMO_USER_KEY);
    return;
  }
  const { error } = await supabase.rpc("delete_own_account");
  if (error) throw error;
  await supabase.auth.signOut();
}

type ProfilePatch = Partial<{
  name: string;
  emoji: string;
  themeColor: string;
  age: number;
  gender: string;
  height: number;
  weight: number;
  skinType: string;
  concern: string;
  diet: string;
  sleep: string;
  stress: string;
  water: string;
  exercise: string;
  makeup: string;
  surveyDone: boolean;
  profilePic: string;
  bmi: number;
}>;

export async function updateProfile(userId: string, patch: ProfilePatch): Promise<void> {
  if (userId === DEMO_USER_ID) return saveDemoUser((u) => ({ ...u, ...patch }));
  const row: Record<string, unknown> = {};
  if (patch.name !== undefined) row.name = patch.name;
  if (patch.emoji !== undefined) row.emoji = patch.emoji;
  if (patch.themeColor !== undefined) row.theme_color = patch.themeColor;
  if (patch.age !== undefined) row.age = patch.age;
  if (patch.gender !== undefined) row.gender = patch.gender;
  if (patch.height !== undefined) row.height = patch.height;
  if (patch.weight !== undefined) row.weight = patch.weight;
  if (patch.skinType !== undefined) row.skin_type = patch.skinType;
  if (patch.concern !== undefined) row.concern = patch.concern;
  if (patch.diet !== undefined) row.diet = patch.diet;
  if (patch.sleep !== undefined) row.sleep = patch.sleep;
  if (patch.stress !== undefined) row.stress = patch.stress;
  if (patch.water !== undefined) row.water = patch.water;
  if (patch.exercise !== undefined) row.exercise = patch.exercise;
  if (patch.makeup !== undefined) row.makeup = patch.makeup;
  if (patch.surveyDone !== undefined) row.survey_done = patch.surveyDone;
  if (patch.profilePic !== undefined) row.profile_pic_path = patch.profilePic;
  if (patch.bmi !== undefined) row.bmi = patch.bmi;
  row.updated_at = new Date().toISOString();

  const { error } = await supabase.from("profiles").update(row).eq("id", userId);
  if (error) throw error;
}

export async function upsertDiaryEntry(userId: string, entry: DiaryRecord): Promise<void> {
  if (userId === DEMO_USER_ID) {
    return saveDemoUser((u) => ({ ...u, diary: { ...u.diary, [entry.date]: entry } }));
  }
  const { error } = await supabase.from("diary_entries").upsert(
    {
      user_id: userId,
      entry_date: entry.date,
      img_path: entry.img ?? null,
      description: entry.desc ?? "",
      products: entry.products,
      score: entry.score,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id,entry_date" },
  );
  if (error) throw error;
}

export async function upsertHabit(
  userId: string,
  date: string,
  patch: Partial<Pick<HabitRecord, "water" | "sleep">>,
): Promise<void> {
  if (userId === DEMO_USER_ID) {
    return saveDemoUser((u) => {
      const prev = u.habits[date] ?? { date, water: 0, sleep: 0 };
      return { ...u, habits: { ...u.habits, [date]: { ...prev, ...patch } } };
    });
  }
  const { data: existing } = await supabase
    .from("habits")
    .select("water, sleep")
    .eq("user_id", userId)
    .eq("entry_date", date)
    .maybeSingle();

  const { error } = await supabase.from("habits").upsert(
    {
      user_id: userId,
      entry_date: date,
      water: patch.water ?? existing?.water ?? 0,
      sleep: patch.sleep ?? existing?.sleep ?? 0,
    },
    { onConflict: "user_id,entry_date" },
  );
  if (error) throw error;
}

export async function addCosmetic(
  userId: string,
  item: Omit<CosmeticItem, "id">,
): Promise<CosmeticItem> {
  if (userId === DEMO_USER_ID) {
    const created = { ...item, id: `demo-${Date.now()}` };
    saveDemoUser((u) => ({ ...u, cosmetics: [...u.cosmetics, created] }));
    return created;
  }
  const { data, error } = await supabase
    .from("cosmetics")
    .insert({ user_id: userId, name: item.name, open_date: item.openDate, months: item.months })
    .select()
    .single();
  if (error || !data) throw error ?? new Error("등록에 실패했습니다.");
  return { id: data.id, name: data.name, openDate: data.open_date, months: data.months };
}

export async function deleteCosmetic(id: string): Promise<void> {
  if (id.startsWith("demo-")) {
    return saveDemoUser((u) => ({ ...u, cosmetics: u.cosmetics.filter((c) => c.id !== id) }));
  }
  const { error } = await supabase.from("cosmetics").delete().eq("id", id);
  if (error) throw error;
}
