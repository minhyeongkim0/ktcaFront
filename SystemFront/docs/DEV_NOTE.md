# 개발 노트

## 접속 주소

**개발 서버**: http://localhost:3000 (포트 고정)

```bash
npm run dev
```

## 브라우저 연결 안 됨 / EPERM 오류

**증상**: `EPERM: operation not permitted, open '.next\trace'` 또는 서버는 뜨는데 브라우저 접속이 안 됨

**해결 순서**:

1. **모든 터미널/서버 종료** – 기존에 실행 중인 `npm run dev` 프로세스 모두 종료
2. **`.next` 폴더 삭제** – 프로젝트 루트에서:
   ```powershell
   Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue
   ```
   또는 탐색기에서 `.next` 폴더 직접 삭제
3. **다시 실행**:
   ```bash
   npm run dev
   ```
4. **브라우저에서** http://localhost:3000 접속 (강력 새로고침 권장: Ctrl+Shift+R)

**여전히 EPERM이 나오면**: 백신·실시간 검사가 `.next`를 잠그는 경우일 수 있습니다. 해당 폴더를 예외 처리하거나, 잠시 백신을 끄고 시도해 보세요.

## 포트 3000 사용 불가 시 진단

3000 포트가 점유되어 있을 경우:

```powershell
netstat -ano | findstr :3000
```

- `LISTENING` 행의 마지막 열이 PID
- 해당 프로세스 종료: `taskkill /PID <PID> /F`
