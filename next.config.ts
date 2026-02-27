import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
