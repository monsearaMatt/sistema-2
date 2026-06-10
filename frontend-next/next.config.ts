import type { NextConfig } from "next";

const backendUrl = process.env.BACKEND_URL ?? "http://localhost:3000";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/logistica/:path*",
        destination: `${backendUrl}/logistica/:path*`,
      },
      {
        source: "/rrhh/:path*",
        destination: `${backendUrl}/rrhh/:path*`,
      },
      {
        source: "/auth/:path*",
        destination: `${backendUrl}/rrhh/auth/:path*`,
      },
    ];
  },
};

export default nextConfig;
