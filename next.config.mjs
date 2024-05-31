/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["images-na.ssl-images-amazon.com"],
  },
  logging: {
    fetches: {
      fullUrl: true, // no idea why revalicating cache doesn't work without this logging
    }
  }
};

export default nextConfig;
