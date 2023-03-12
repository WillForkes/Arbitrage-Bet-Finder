/** @type {import('next').NextConfig} */



const nextConfig = {
  async redirects() {
    return [
      {
        source: '/auth/login',
        destination: 'http://localhost:3000/login',
        permanent: false,
        basePath: false
      },
    ];
  }
}




module.exports = nextConfig
  