# 여치들 랜딩페이지

빌드 없는 정적 사이트(HTML + CSS)예요. 앱(`../`)과 별개의 Vercel 프로젝트로 배포해요.

## 수정할 곳

- **사전신청 폼 주소**: `index.html` 맨 아래 `APPLY_URL = ""` 에 구글폼 링크를 넣으면 모든 신청 버튼에 적용돼요.
- **팀 소개**: `index.html`의 `id="team"` 섹션에서 `TODO` 표시된 이름·역할·소개를 바꿔주세요. 사진은 `assets/team/`에 넣고 `.avatar` 안에 `<img>`로 넣으면 돼요.
- **앱 화면 이미지**: `assets/screens/*.webp`

## 로컬에서 보기

```sh
npx serve landing
```

## Vercel 배포

Vercel → Add New → Project → 같은 GitHub 저장소 선택 → **Root Directory를 `landing`** 으로 지정 →
Framework Preset은 **Other**, 빌드 명령은 비워두고 Deploy.
