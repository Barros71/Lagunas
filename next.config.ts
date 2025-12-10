/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Note: Authentication is handled via middleware.ts (deprecated but functional).
  // For new projects, consider using next/auth or a custom proxy solution.
};

export default nextConfig;
