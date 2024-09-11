/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.public.blob.vercel-storage.com',
      },
      {
        protocol: 'https',
        hostname: '*oaidalleapiprodscus.blob.core.windows.net',
      },
    ],
  },
};

export default nextConfig;
