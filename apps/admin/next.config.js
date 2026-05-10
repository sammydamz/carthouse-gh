/** @type {import('next').NextConfig} */

module.exports = {
   turbopack: {
      root: 'D:\\Damz Proj\\Auto\\next-prisma-tailwind-ecommerce',
   },
   allowedDevOrigins: ['192.168.100.19'],
   images: {
      remotePatterns: [
         {
            protocol: 'https',
            hostname: '**',
         },
      ],
   },
   async headers() {
      return [
         {
            source: '/api/:path*',
            headers: [
               { key: 'Access-Control-Allow-Origin', value: 'https://eafcautos.vercel.app' },
               { key: 'Access-Control-Allow-Methods', value: 'GET, POST, PUT, DELETE, OPTIONS' },
               { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
               { key: 'Access-Control-Max-Age', value: '86400' },
            ],
         },
      ]
   },
}
