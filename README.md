# 쇼츠체크 / shorts-check

유튜브 쇼츠 대본의 예상 낭독 시간을 계산하는 무료 정적 웹 앱입니다. 한국어와
영어, 네 가지 낭독 속도, 30/45/60초 적합도, 예상 자막 줄 수, 긴 문장 경고,
첫 3초 훅 체크리스트와 업로드 체크리스트를 제공합니다.

서버, 로그인, 데이터베이스, 유료 API가 없으며 대본은 브라우저 안에서만
처리됩니다.

## 로컬 실행

Node.js 20 이상을 권장합니다.

```bash
npm test
npm run check
npm run build
npx serve dist
```

별도 패키지를 설치하지 않아도 테스트와 빌드가 동작합니다. `npx serve dist`는
로컬 미리보기를 위한 선택 사항입니다.

## 스크립트

- `npm test`: 계산 로직 단위 테스트
- `npm run check`: JavaScript 문법 검사
- `npm run build`: Cloudflare Pages 배포용 파일을 `dist/`에 생성

## Cloudflare Pages 배포

1. 이 저장소를 GitHub 또는 GitLab에 올립니다.
2. Cloudflare 대시보드에서 **Workers & Pages > Create > Pages > Connect to Git**을
   선택합니다.
3. 저장소를 선택하고 아래 빌드 설정을 입력합니다.

| 항목 | 값 |
| --- | --- |
| Framework preset | None |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Root directory | 비워 둠 |
| Environment variables | 없음 |

4. **Save and Deploy**를 선택합니다.

Cloudflare Pages는 `dist/_headers`의 기본 보안 헤더를 자동으로 적용합니다.

## 공개 전 필수 확인

- 실제 도메인이 정해지면 각 페이지에 canonical URL을 추가하고 `sitemap.xml`을
  생성합니다.
- AdSense를 추가할 경우 광고 스크립트 적용 전에 `privacy.html`의 광고 및 쿠키
  항목과 필요한 동의 절차를 업데이트합니다.
- 실제 낭독 샘플로 한국어 분당 300자, 영어 분당 150단어 기준이 목표 채널에
  맞는지 확인합니다.

## 계산 기준

- 한국어: 분당 300자
- 영어: 분당 150단어
- 자막: 한국어 한 줄 18자, 영어 한 줄 32자
- 긴 문장: 한국어 45자 초과, 영어 24단어 초과
- 목표 시간의 10% 이내 초과는 "조금 줄이기", 그 이상은 "압축 필요"로 표시

결과는 편집을 돕는 추정치이며 실제 녹음 시간은 쉼, 억양, 효과음과 편집에 따라
달라질 수 있습니다.
