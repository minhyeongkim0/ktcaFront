This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

접속 주소: **http://localhost:3000**

브라우저에서 위 주소로 접속하거나, Cursor 안에서 `Ctrl+Shift+P` → "Simple Browser: Show" 입력 후 URL에 `http://localhost:3000` 입력. 자세한 내용은 [VIEW_IN_CURSOR.md](./VIEW_IN_CURSOR.md) 참고. 포트 관련 진단은 [docs/DEV_NOTE.md](./docs/DEV_NOTE.md) 참고.

### Tableau Public 임베딩 (CSP)

운용 > 공정관리 탭의 OHT 설비 통합 관제판은 Tableau Public iframe을 사용합니다. 앱에 Content-Security-Policy가 적용되어 있다면 최소한 아래를 허용해야 합니다.

- `frame-src` (또는 `child-src`): `https://public.tableau.com`
- `img-src`: `https://public.tableau.com`

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
