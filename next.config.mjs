import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const candidateMonorepoRoot = resolve(__dirname, '../..');
const outputFileTracingRoot = existsSync(resolve(candidateMonorepoRoot, 'apps/web/package.json'))
  ? candidateMonorepoRoot
  : __dirname;

/** @type {import('next').NextConfig} */
const nextConfig = {
  typedRoutes: true,
  // Use the monorepo root locally, but do not trace above a standalone Vercel checkout.
  outputFileTracingRoot,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
      { protocol: 'http', hostname: 'cdn.local' },
      { protocol: 'http', hostname: 'localhost' }
    ]
  }
};

export default nextConfig;
