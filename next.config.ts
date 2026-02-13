import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
import type { NextConfig } from "next";

// Enable OpenNext Cloudflare integration for `next dev`
initOpenNextCloudflareForDev();

// Silence workspace-root inference warning by pinning tracing root to this repo
const nextConfig: NextConfig = {
  outputFileTracingRoot: __dirname,
};
export default nextConfig;
