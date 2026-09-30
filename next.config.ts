import type { NextConfig } from "next";

// GitHub Pages serves a project site from /<repo>; the deploy workflow passes
// that prefix in. Locally (and on a custom domain) it is empty.
const basePath = process.env.PAGES_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  trailingSlash: true,
  images: { unoptimized: true },
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
};

export default nextConfig;
