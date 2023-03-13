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
  }
}




module.exports = nextConfig
  