/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.unsplash.com', 'res.cloudinary.com'],
  },
  // Remove webpack warnings about the exclamation mark in folder path
  webpack: (config, { isServer }) => {
    return config;
  },
}

module.exports = nextConfig 