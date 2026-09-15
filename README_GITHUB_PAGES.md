# AI 현실 직업검사 - GitHub Pages 최종 배포

## 1. GitHub Pages에 올리기
1. GitHub에서 새 Repository를 만듭니다. 예: `ai-real-job-test`
2. 이 폴더의 `index.html`을 Repository 루트에 업로드합니다.
3. Repository의 `Settings` → `Pages` → `Build and deployment`에서 `Deploy from a branch`를 선택합니다.
4. Branch는 `main`, Folder는 `/ (root)`로 선택하고 Save합니다.
5. 잠시 기다리면 `https://본인아이디.github.io/ai-real-job-test/`에서 검사할 수 있습니다.

## 2. 피드백 자동수집 + 이메일
정적 GitHub Pages는 자체 데이터베이스나 이메일 발송 서버가 없으므로 Google Apps Script를 작은 백엔드로 사용합니다.

1. Google Drive에서 Google Sheets를 하나 새로 만들거나, 아무 Google Sheets를 준비합니다.
2. `확장 프로그램` → `Apps Script`를 엽니다.
3. 기존 코드를 삭제하고 `Code.gs` 내용을 붙여넣습니다.
4. 저장합니다.
5. `배포` → `새 배포` → 유형 `웹 앱`을 선택합니다.
6. 실행 사용자: `나`
7. 액세스 권한: `모든 사용자`
8. 배포 후 나온 `/exec` URL을 복사합니다.
9. GitHub의 `index.html`에서 다음 부분을 찾습니다.

   `const FEEDBACK_ENDPOINT = "PASTE_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE";`

   여기에 복사한 `/exec` URL을 넣고 다시 Commit합니다.

10. 첫 피드백이 들어오면 Apps Script가 `AI 현실 직업검사 - 수검자 피드백` 스프레드시트를 자동 생성하고, `feedback` 시트에 기록합니다. 동시에 `ttt6631@naver.com`으로 이메일을 보냅니다.

### 중요
- `Code.gs`에는 사용자의 네이버 메일 주소가 들어 있습니다.
- 검사 HTML에는 Google Apps Script URL만 들어가며, 메일 비밀번호나 Google 인증정보를 넣지 않습니다.
- GitHub 저장소는 공개 저장소가 될 수 있으므로 개인식별정보나 비밀번호를 HTML에 넣으면 안 됩니다.
- 수검자에게는 주민등록번호, 전화번호, 상세 주소 등 민감한 개인정보를 입력하지 말라고 안내하는 것이 좋습니다.

## 3. 데이터로 쌓이는 내용
- 검사 버전/시간
- TOP 10 추천 직업과 점수
- 각 추천 직업에 대한 `잘 맞음 / 반반 / 전혀 안 맞음`
- 학력/경력/자격/근무조건 등 검사 조건
- 자유 건의사항/특이점

이 데이터가 쌓이면 이후 실제 사용자 반응을 기준으로 추천 알고리즘을 수정할 수 있습니다.
