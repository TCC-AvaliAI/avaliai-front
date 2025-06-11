import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    SUAP_CLIENT_ID: process.env.SUAP_CLIENT_ID,
    SUAP_CLIENT_SECRET: process.env.SUAP_CLIENT_SECRET,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
  headers: async () => {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: "*",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
