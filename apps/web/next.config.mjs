/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@qisas/types"],
  webpack: (config, { dev }) => {
    if (dev) {
      config.cache = false;
    }
    return config;
  },
};

export default nextConfig;
