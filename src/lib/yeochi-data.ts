export type Product = {
  name: string;
  brand: string;
  ingredients: string;
  effect: string;
  reviews: string[];
  score: number;
  price: string;
};

export const PRODUCT_DB: Record<string, Product[]> = {
  토너: [
    { name: "어성초 77 진정 토너", brand: "Anua", ingredients: "어성초추출물(77%), 병풀추출물, 판테놀", effect: "여드름 진정 및 유수분 밸런스", reviews: ["좁쌀 여드름에 효과 최고!", "물 제형이라 산뜻해요.", "성분이 착해서 믿고 써요."], score: 4.9, price: "25,000원" },
    { name: "1025 독도 토너", brand: "Round Lab", ingredients: "해수, 판테놀, 알란토인, 베타인", effect: "저자극 각질 케어", reviews: ["자극 없이 순해요.", "피부 결이 매끈.", "가성비 갑."], score: 4.8, price: "15,000원" },
    { name: "3번 결광가득 에센스 토너", brand: "numbuzin", ingredients: "50가지 발효성분, 나이아신아마이드", effect: "광채 및 결 개선", reviews: ["화장 잘 먹어요.", "에센스처럼 쫀쫀.", "컨디션 안 좋을 때 필수!"], score: 4.7, price: "22,000원" },
    { name: "자작나무 수분 토너", brand: "Round Lab", ingredients: "자작나무 수액, 히알루론산", effect: "깊은 수분 공급", reviews: ["속건조 잡아줘요.", "촉촉함이 오래가요.", "흡수 빨라요."], score: 4.8, price: "18,000원" },
    { name: "아토베리어365 하이드로 에센스", brand: "AESTURA", ingredients: "BMF11, 아미노산, 스쿠알란", effect: "장벽 강화 및 진정", reviews: ["민감성에 강추.", "장벽이 튼튼해져요.", "인생 토너."], score: 4.9, price: "28,000원" },
  ],
  에센스: [
    { name: "다이브인 저분자 히알루론산 세럼", brand: "Torriden", ingredients: "5D 히알루론산, 판테놀, 마데카소사이드", effect: "속보습 및 진정", reviews: ["수분 앰플의 혁명.", "끈적임 없이 흡수.", "벌써 5통째."], score: 4.9, price: "18,000원" },
    { name: "잡티세럼", brand: "isoi", ingredients: "불가리안 로즈, 알부틴, 어성초", effect: "잡티 케어 및 톤 개선", reviews: ["여드름 흉터 연해졌어요.", "향이 좋아요.", "맑아져요."], score: 4.8, price: "29,500원" },
    { name: "청귤 비타C 잡티 세럼", brand: "goodal", ingredients: "청귤추출물 70%, 비타민C 유도체", effect: "생기 부여, 잡티 완화", reviews: ["피부가 환해져요.", "순해요.", "꾸준히 쓰니 효과."], score: 4.7, price: "24,000원" },
    { name: "스네일 96 뮤신 에센스", brand: "COSRX", ingredients: "달팽이점액 96%", effect: "여드름 재생", reviews: ["결이 좋아져요.", "쫀득쫀득.", "자생력 굿."], score: 4.8, price: "16,800원" },
    { name: "아쿠아 스쿠알란 세럼", brand: "S.NATURE", ingredients: "스쿠알란, 베타인, 판테놀", effect: "수분 밀착 보습", reviews: ["광채 장난 아님.", "건성 필수.", "꿀피부."], score: 4.9, price: "26,000원" },
  ],
  앰플: [
    { name: "센텔라 앰플", brand: "SKIN1004", ingredients: "병풀추출물 100%", effect: "강력 진정 및 장벽", reviews: ["순수 병풀, 순함.", "붉은기 최고!", "편안해져요."], score: 4.9, price: "14,900원" },
    { name: "히알루로닉 블루 100 앰플", brand: "Wellage", ingredients: "히알루론산, 판테놀, 베타글루칸", effect: "100시간 보습", reviews: ["보습 오래가요.", "건조함 싹.", "수분 팡팡."], score: 4.8, price: "21,000원" },
    { name: "시카풀 앰플 II", brand: "beplain", ingredients: "병풀 84%, 마데카소사이드", effect: "여드름 트러블 진정", reviews: ["트러블 필수.", "흡수 빨라요.", "민감할 때 굿."], score: 4.7, price: "19,000원" },
    { name: "타임 레볼루션 나이트 앰플", brand: "MISSHA", ingredients: "익스트림 바이옴, 비피다발효", effect: "안티에이징 및 광채", reviews: ["다음날 달라져요.", "영양 가득.", "쫀쫀."], score: 4.8, price: "34,000원" },
    { name: "시카페어 세럼", brand: "Dr.Jart+", ingredients: "센텔라 RX, 시카본드", effect: "민감 회복 및 진정", reviews: ["믿고 쓰는 시카.", "컨디션 회복.", "자극 케어."], score: 4.9, price: "38,000원" },
  ],
  크림: [
    { name: "레드 블레미쉬 클리어 수딩크림", brand: "Dr.G", ingredients: "5-시카 콤플렉스, 베타글루칸", effect: "여드름성 피부 수분 진정", reviews: ["여름에도 굿!", "트러블 안 나요.", "수딩 최고."], score: 4.9, price: "21,000원" },
    { name: "세라마이드 아토 집중크림", brand: "illiyoon", ingredients: "세라마이드, 인삼추출물", effect: "고보습 장벽 보호", reviews: ["온 가족 사용.", "보습 끝판왕.", "가려움 완화."], score: 4.8, price: "12,000원" },
    { name: "시카플라스트 밤 B5+", brand: "La Roche-Posay", ingredients: "판테놀, 마데카소사이드", effect: "극민감 케어", reviews: ["뒤집어졌을 때 구원.", "쫀쫀해요.", "흉터 도움."], score: 4.7, price: "26,000원" },
    { name: "제로 모공 크림 2.0", brand: "medicube", ingredients: "모공 수렴 성분", effect: "모공 수렴 및 피지 조절", reviews: ["모공 작아져요.", "유분기 잡음.", "결 매끈."], score: 4.8, price: "28,000원" },
    { name: "DMT 페이셜 크림", brand: "Physiogel", ingredients: "BioMimic 지질", effect: "72시간 보습", reviews: ["겨울 필수.", "장벽 튼튼.", "속건조 사라짐."], score: 4.9, price: "24,500원" },
  ],
  클렌징: [
    { name: "퓨어 클렌징 오일", brand: "manyo", ingredients: "쌀겨오일, 아르간오일", effect: "블랙헤드 및 메이크업 세정", reviews: ["피지 쏙쏙.", "눈 안 시려요.", "완벽 세정."], score: 4.9, price: "19,000원" },
    { name: "클린 잇 제로 클렌징밤", brand: "BANILA CO", ingredients: "아세로라 추출물", effect: "원스텝 세정", reviews: ["잘 지워져요.", "밤 제형 편함.", "이중세안 불필요."], score: 4.8, price: "18,000원" },
    { name: "그린티 약산성 클렌징폼", brand: "ROUND A'ROUND", ingredients: "녹차수, 약산성, 병풀", effect: "저자극 수분 세안", reviews: ["안 당겨요.", "성분 착함.", "거품 부드러움."], score: 4.7, price: "12,000원" },
    { name: "클렌징 워터 브라이트닝", brand: "Bifesta", ingredients: "히알루론산, 비타민C", effect: "산뜻한 세정", reviews: ["가볍게 닦임.", "맑아져요.", "잔여감 없음."], score: 4.8, price: "14,000원" },
    { name: "세이프 미 릴리프 클렌징폼", brand: "make p:rem", ingredients: "라즈베리, 판테놀", effect: "민감 피부 안심 세안", reviews: ["거품 쫀쫀.", "인생 폼.", "자극 제로."], score: 4.9, price: "14,000원" },
  ],
};

export const CATEGORIES = ["토너", "에센스", "앰플", "크림", "클렌징"] as const;

export const PRODUCT_LIST: string[] = Object.values(PRODUCT_DB).flatMap((arr) =>
  arr.map((p) => `${p.brand} ${p.name}`),
);

export const EMOJI_PRESETS = ["O", "X", "V", "*", "+"];
export const COLOR_PRESETS = ["#FF8C42", "#FF6B9D", "#7BC47F", "#5BA3D9", "#B57BFF"];

export const SURVEY_DIET = ["한식 위주", "육류 위주", "채식 위주", "배달/패스트푸드", "불규칙함"];
export const SURVEY_SLEEP = ["4시간 이하", "5시간", "6시간", "7시간", "8시간 이상"];
export const SKIN_TYPES = ["건성", "복합성", "지성", "민감성", "잘 모르겠음"];
export const ACNE_CONCERNS = ["좁쌀 여드름", "화농성 여드름", "붉은기", "흉터/색소침착", "건조함", "없음"];
export const STRESS_LEVEL = ["낮음", "보통", "높음", "매우 높음"];
export const WATER_INTAKE = ["1잔 이하", "2-3잔", "4-6잔", "7잔 이상"];
export const EXERCISE_FREQ = ["거의 안 함", "주 1-2회", "주 3-4회", "매일"];
export const MAKEUP_FREQ = ["거의 안 함", "주 2-3회", "거의 매일", "매일 진하게"];