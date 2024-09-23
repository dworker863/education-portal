/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com', // Хост изображений Google
        pathname: '**', // Разрешаем любые пути
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com', // Хост изображений Github
        pathname: '**', // Разрешаем любые пути
      },
    ],
  },
};

export default nextConfig;
