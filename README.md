# Texno Camera

Modern product-catalog website for security cameras, video intercoms, access-control devices, recorders, and related equipment.

Built with **Next.js**, **TypeScript**, **React Query**, and **Zustand**, with a responsive Uzbek-first product-discovery experience.

## Features

- Structured catalog with more than 50 security products
- Product search and category filtering
- In-stock filtering and sorting
- URL-driven filter state for shareable catalog views
- Responsive product grids and product-detail pages
- Server-rendered catalog routes
- API-driven data loading with React Query
- Lightweight client state management with Zustand
- Railway and Vercel-compatible builds

## Technology stack

| Area | Technologies |
|---|---|
| Framework | Next.js 15, React 19 |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Server state | TanStack React Query |
| Client state | Zustand |
| Icons | Lucide React |
| Deployment | Railway / Vercel |

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3001](http://localhost:3001).

## Environment configuration

```env
NEXT_PUBLIC_API_URL=https://your-api.example.com
```

Values prefixed with `NEXT_PUBLIC_` are embedded during the production build, so configure them before running `npm run build`.

## Available scripts

```bash
npm run dev
npm run build
npm run start
npm run typecheck
```

## Repository hygiene

Product media can make this repository large. New high-resolution assets should be compressed and, where appropriate, moved to object storage or Git LFS. Secrets and local environment files must never be committed.

## Planned improvements

- Add automated unit and end-to-end tests
- Add GitHub Actions for type checking and builds
- Add optimized product-image delivery
- Publish deployment and API documentation
- Add product analytics and structured SEO metadata

## Author

Built by [Bekzod Sirojiddinov](https://github.com/paxbyme).

[LinkedIn](https://www.linkedin.com/in/paxbyme) · [Telegram](https://t.me/lazyswe) · [Email](mailto:contact@paxbyme.dev)
