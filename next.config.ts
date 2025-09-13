import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

// Enable OpenNext Cloudflare integration for `next dev`
initOpenNextCloudflareForDev();

const nextConfig: NextConfig = {};
export default nextConfig;
