import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/monitoring", destination: "/fdc", permanent: false },
      { source: "/operation", destination: "/fdc", permanent: false },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: [
              "frame-src 'self' https://public.tableau.com https://*.tableau.com",
              "connect-src 'self' https://public.tableau.com https://*.tableau.com",
              "img-src 'self' data: blob: https://public.tableau.com https://*.tableau.com",
            ].join("; "),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
