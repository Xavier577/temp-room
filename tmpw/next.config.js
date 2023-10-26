/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    tempRoomBaseUrl: process.env.TEMPROOM_BASE_URL,
    temproomSocketBaseUrl: process.env.TEMPROOM_SOCKET_BASE_URL,
  },
};

module.exports = nextConfig;
