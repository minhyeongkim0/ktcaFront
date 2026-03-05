import type { NextConfig } from "next";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8000";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/backend/:path*",
        destination: `${BACKEND_URL}/:path*`,
      },
    ];
  },
  async redirects() {
    return [
      { source: "/context", destination: "/management?tab=overview", permanent: true },
      { source: "/leadership", destination: "/management?tab=leadership", permanent: true },
      { source: "/planning", destination: "/management?tab=planning", permanent: true },
      { source: "/support", destination: "/management?tab=resources", permanent: true },
      { source: "/operation", destination: "/fdc?tab=monitoring", permanent: true },
      { source: "/performance", destination: "/fdc?tab=kpi", permanent: true },
      { source: "/improvement", destination: "/fdc?tab=improvement", permanent: true },
      { source: "/guideline", destination: "/", permanent: true },
      { source: "/monitoring", destination: "/fdc?tab=monitoring", permanent: true },
    ];
  },
};

export default nextConfig;
