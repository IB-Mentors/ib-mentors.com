import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // URLs are kept exactly as Framer and the static mirror serve them: no trailing slash.
  trailingSlash: false,
  // Lets a production build run beside the dev server (NEXT_DIST_DIR=.next-build npm run build).
  distDir: process.env.NEXT_DIST_DIR || ".next",
  images: { unoptimized: true },
  async redirects() {
    return [
      // www.ib-mentors.com 308s to the apex, as the static mirror's vercel.json did.
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.ib-mentors.com" }],
        destination: "https://ib-mentors.com/:path*",
        permanent: true,
      },
      // The static mirror served /<route>/index.html files.
      { source: "/index.html", destination: "/", permanent: true },
      { source: "/:path*/index.html", destination: "/:path*", permanent: true },
    ];
  },
};

export default nextConfig;
