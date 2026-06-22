import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  typedRoutes: true,
  // Pin the monorepo root so Next doesn't pick the stray ~/package-lock.json
  outputFileTracingRoot: resolve(__dirname, '../..'),
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
      { protocol: 'http', hostname: 'cdn.local' },
      { protocol: 'http', hostname: 'localhost' }
    ]
  }
};

export default nextConfig;
