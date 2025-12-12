// import withPWA from 'next-pwa';

const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ivufhejdmtyzxqcocmaq.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
};

export default nextConfig;

// PWA disabled temporarily to fix caching issues
// Will re-enable after proper cache strategy is implemented
