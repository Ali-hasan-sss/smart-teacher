/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // إعدادات للوصول من الشبكة المحلية
  experimental: {
    serverComponentsExternalPackages: [],
  },
};

export default nextConfig;
