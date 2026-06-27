# texnocamera

## Vercel deploy

- Deploy this app from the web app root. If importing only this repository,
  leave Root Directory empty. If importing the parent monorepo, set Root
  Directory to `apps/web`.
- Framework Preset: `Next.js`
- Build Command: `npm run build`
- Output Directory: `.next`
- Do not set Output Directory to an absolute Vercel path such as
  `/vercel/path0/.next`; it must stay relative to the selected project root.
- Set `API_URL` to the deployed API service URL. `NEXT_PUBLIC_API_URL` is
  optional and should only be set when the browser must call the API directly.

## Railway deploy

Web service:

- Set `API_URL` to the deployed API service URL. The Next app proxies
  `/api/v1/...` requests to this backend in production.
- `NEXT_PUBLIC_API_URL` is optional. Set it only if the browser should call the
  API directly instead of the same-origin proxy.

API service:

- Make sure the Nest API listens on Railway's `PORT` value, or set `API_PORT` to
  the port Railway exposes for the service.
- Set `CORS_ORIGIN` to the web service URL if using direct browser API calls.
- Set Telegram, database, Redis and other required secret variables in Railway,
  not in committed files.
