/** @type {import('next').NextConfig} */



const nextConfig = {
  async redirects() {
    return [
      {
        source: '/auth/login',
        destination: 'http://localhost:3000/login',
        permanent: true,
        basePath: false
      },
    ];
  },
  images: {
    domains: ['oddsjam.com', 'flowbite.s3.amazonaws.com', 'www.top100bookmakers.com'],
  },
}




module.exports = nextConfig
  