// frontend/next.config.js

/*
/** @type {import('next').NextConfig} 
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
};

module.exports = nextConfig;
*/

// next.config.js
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: process.env.NEXT_PUBLIC_API_URL + "/:path*", // ปรับตาม URL ของ backend
      },
    ];
  },
};

module.exports = nextConfig;
