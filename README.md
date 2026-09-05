# 여치들 — 스마트 여드름 분석 파트너

청소년을 위한 여드름 관리 보조 서비스 MVP입니다. 피지 반응 패치로 측정한 데이터를 앱에서
분석하고, 사용자 맞춤 스킨케어 루틴과 제품을 추천합니다.

## 기술 스택

- [TanStack Start](https://tanstack.com/start) (React 19 + Vite 7, SSR)
- [Supabase](https://supabase.com) — 인증(Auth), 데이터베이스(Postgres + RLS), 파일 저장(Storage)
- Tailwind CSS 4, Radix UI
- 배포: [Render](https://render.com) (Node 웹 서비스)

## 로컬 개발

```sh
npm install     # 또는 bun install
cp .env.example .env   # VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY 값 입력
npm run dev     # 또는 bun run dev
```

## 환경 변수

| 변수 | 설명 |
| --- | --- |
| `VITE_SUPABASE_URL` | Supabase 프로젝트 API URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon(publishable) 키 |

## Supabase 스키마

`profiles`(1:1 계정 정보), `diary_entries`(여드름 기록), `habits`(생활 습관),
`cosmetics`(화장품 유통기한) 테이블과 `photos` Storage 버킷을 사용합니다. 모든 테이블에
Row Level Security가 적용되어 있어 각 사용자는 자신의 데이터만 읽고 쓸 수 있습니다.

회원가입 시 `auth.users`에 트리거가 걸려 `profiles` 행이 자동 생성되고, 회원 탈퇴는
`delete_own_account()` RPC로 본인 계정과 관련 데이터를 함께 삭제합니다.

> Supabase 프로젝트의 Authentication 설정에서 이메일 확인(Confirm email)이 켜져 있으면
> 가입 직후 로그인 세션이 바로 생기지 않고 확인 메일을 받아야 합니다. 별도 확인 없이 바로
> 이용할 수 있게 하려면 Supabase 대시보드 → Authentication → Providers → Email에서
> "Confirm email"을 꺼주세요.

## Render 배포

이 저장소에는 `render.yaml`이 포함되어 있습니다. Render에서 "New +" → "Blueprint"로 이
저장소를 연결하면 빌드/시작 명령이 자동으로 구성됩니다.

- Build: `npm install && npm run build`
- Start: `node dist/server/server.js`
- 환경 변수: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`를 Render 대시보드에서 직접 입력

## 빌드

```sh
npm run build
node dist/server/server.js
```
