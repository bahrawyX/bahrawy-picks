/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      'date-fns',
      'libphonenumber-js',
      'framer-motion',
      'react-day-picker',
    ],
  },
}

export default nextConfig
