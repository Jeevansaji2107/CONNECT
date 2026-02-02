import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "avatars.githubusercontent.com",
      "lh3.googleusercontent.com",
      "api.dicebear.com",
      "i.pinimg.com"
    ],
    dangerouslyAllowSVG: true,
  },
};

export default nextConfig;
