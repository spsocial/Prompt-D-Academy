import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'firebasestorage.googleapis.com' },
      { protocol: 'https', hostname: 'i.ytimg.com' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: 'drive.google.com' },
    ],
  },
  // URL ของเว็บเวอร์ชันเก่า → หน้าใหม่ (รักษาอันดับ SEO)
  async redirects() {
    return [
      { source: '/tool/:id', destination: '/courses/:id', permanent: true },
      { source: '/learning-path/:id', destination: '/courses', permanent: true },
      { source: '/video/:id', destination: '/courses', permanent: true },
      { source: '/whats-new', destination: '/', permanent: true },
      { source: '/pending-approval', destination: '/dashboard', permanent: true },
      { source: '/admin/ai-tools/:path*', destination: '/admin/courses', permanent: false },
      { source: '/admin/learning-paths/:path*', destination: '/admin/courses', permanent: false },
    ];
  },
};

export default nextConfig;
