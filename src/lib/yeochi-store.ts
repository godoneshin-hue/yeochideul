import { createContext, useContext } from "react";

export type DiaryRecord = {
  date: string; // YYYY-MM-DD
  img?: string; // dataURL
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
  name: string;
  email: string;
  password: string;
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
  name: "",
  email: "",
  password: "",
  emoji: "🍊",
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