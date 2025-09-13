import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

// Enable OpenNext Cloudflare integration for `next dev`
initOpenNextCloudflareForDev();

// Silence workspace-root inference warning by pinning tracing root to this repo
const nextConfig: NextConfig = {
  outputFileTracingRoot: __dirname,
};
export default nextConfig;
