# 리필링크 랜딩 페이지

버려질 마감 음식을 매출로 바꾸는 마감 재고 판매 플랫폼 — 점주 입점 신청(lead) 랜딩 페이지.
손그림(hand-drawn) 일러스트 + 따뜻한 일러 배경 스타일.

## 폴더 구조
```
index.html            시맨틱 마크업 (섹션 12개)
css/style.css         전체 스타일 (디자인 토큰 + 컴포넌트)
js/
  firebase-config.js  Supabase / Firebase / GA 설정
  analytics.js        trackEvent / GA 초기화
  firebase.js         Firestore (선택, USE_FIREBASE)
  supabase.js         입점 신청 → Supabase (owner_applications)
  main.js             인터랙션 (reveal/nav/계산기/FAQ/폼)
supabase/migrations/  owner_applications 테이블 SQL
images/               손그림 일러스트 SVG (필터 내장, 외부 로드)
firebase.json / firestore.rules / .firebaserc   Firebase Hosting 배포용
```

## 섹션 순서
1. 히어로  2. 문제 공감  3. 손실 계산기  4. 차별화 비교
5. 이용 방식 4단계  6. 점주 혜택  7. 예측 기능(예정)
8. 사장님의 하루(스토리)  9. 비전  10. 최종 CTA  11. FAQ  12. 입점 상담 신청

## 로컬 실행
`index.html`을 브라우저로 바로 열면 됩니다. (이미지/CSS/JS 모두 상대경로)

## Supabase 연동 (입점 상담)
1. `supabase/migrations/20260521120000_create_owner_applications.sql`을 Supabase SQL Editor에서 실행 (이미 적용했다면 생략).
2. `js/firebase-config.js`의 `supabaseUrl`, `supabaseAnonKey` 확인 (`USE_SUPABASE: true`).
3. 제출 시 `owner_applications` 테이블에 저장됩니다 (`js/supabase.js`).

## Firebase 연동 (선택)
1. `USE_FIREBASE: true` 및 `firebaseConfig` 입력 시 Firestore `ownerApplications` 사용.
2. Supabase가 꺼져 있을 때만 Firebase·mock으로 동작합니다.

## 배포 (Firebase Hosting)
```
firebase deploy
```
