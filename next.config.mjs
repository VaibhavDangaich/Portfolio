/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // the imperative scripts mount once and own DOM nodes; double-invoke effects in dev would attach handlers twice
};

export default nextConfig;
