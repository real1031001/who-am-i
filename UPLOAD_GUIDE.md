# WHO AM I 업로드 설명서

## 1. ZIP 압축 해제 → GitHub 업로드

1. ZIP을 PC에서 압축 해제합니다.
2. https://github.com/real1031001/who-am-i 에 접속합니다.
3. 빈 저장소의 `uploading an existing file` 또는 `Add file → Upload files`를 선택합니다.
4. 압축을 푼 폴더 **내부의 파일과 dist·tests 폴더 전체**를 업로드 영역에 끌어놓습니다. ZIP 자체나 바깥 폴더를 올리지 않습니다.
5. `Commit changes`로 저장합니다. 기본 브랜치는 `main`입니다.
6. 저장소 첫 화면에 package.json, server.mjs, game.mjs, render.yaml, dist, tests가 보여야 합니다.
7. dist/assets 안에 club.png와 characters.png가 있는지 확인합니다.

## 2. Render 배포 — 아래 두 방법 중 하나만 사용

### 방법 A: 설정 파일 사용

GitHub에 render.yaml 업로드가 완료된 **다음** 접속합니다:

https://dashboard.render.com/blueprint/new?repo=https://github.com/real1031001/who-am-i

My Workspace를 선택하고 GitHub 권한을 연결합니다. main 브랜치의 render.yaml을 사용하고, 표시되는 서비스가 who-am-i / Node / Singapore / Free인지 검토한 뒤 배포합니다. 무료 서비스 사용 가능 여부는 계정의 생성 화면에서 확인합니다. 유료 플랜을 선택할 필요는 없습니다.

### 방법 B: Web Service 수동 생성

Render 대시보드 → New → Web Service → real1031001/who-am-i 연결.

| 항목 | 입력값 |
|---|---|
| Name | who-am-i |
| Language / Runtime | Node |
| Branch | main |
| Region | Singapore |
| Root Directory | 비워 둠 |
| Build Command | npm test |
| Start Command | npm start |
| Instance Type | Free |
| Health Check Path (고급 설정) | /health |

별도 데이터베이스, API 키, 환경변수는 필요 없습니다. Node.js 22 이상은 package.json에 명시되어 있습니다. Static Site가 아닌 **Web Service**를 선택합니다.

## 3. 배포 후 확인

1. 상태가 Live가 되면 Render에 표시된 실제 서비스 주소를 엽니다.
2. 주소 뒤에 /health를 붙여 {"ok":true}가 나오는지 확인합니다.
3. 친구 또는 서로 다른 브라우저 세션으로 최소 3명이 입장합니다.
4. 닉네임·캐릭터 설정 → 모두 준비 완료 → 방장 게임 시작.
5. 본인 정체는 ???, 본인 목록은 녹색, 현재 차례는 빨간 테두리인지 확인합니다.
6. 한 참가자가 새로고침했을 때 같은 번호·캐릭터로 복귀하는지 확인합니다.
7. 실제 서비스 주소를 이 채팅에 보내면 이후 배포 확인을 이어갈 수 있습니다.

## 파일별 역할

- server.mjs: HTTP 서버, 방·세션 연결, 실시간 이벤트
- game.mjs: 서버 권한으로 판정하는 게임 규칙
- dist/online.html·online.js·online.css: 실제 멀티플레이 화면
- dist/index.html·app.js: /preview에서 제공하는 예시 화면
- dist/style.css·assets/: 공통 디자인·승인된 이미지
- tests/: 게임 규칙·HTTP 연동 테스트
- render.yaml: Render 배포 설정

## 현재 운영 제한

방 정보는 서버 메모리에 저장됩니다. 서버 재시작·재배포 시 진행 중인 게임이 초기화됩니다. 60초 재접속은 서버가 유지된 상태에서 같은 브라우저 탭을 새로고침하거나 연결이 잠시 끊긴 경우를 지원합니다. 새 탭·다른 기기에서 기존 참가자를 복원하는 기능은 없습니다.

## 오류가 나면

- package.json을 못 찾음: 바깥 폴더째 업로드했는지 확인합니다.
- 이미지가 없음: dist/assets 두 PNG가 업로드됐는지 확인합니다.
- npm test 실패: Render 로그의 실패 부분을 이 채팅에 전달합니다.
- 홈페이지가 단순 체험판만 보임: Web Service인지, 시작 명령이 npm start인지 확인합니다.

참고 문서: https://render.com/docs/blueprint-spec
