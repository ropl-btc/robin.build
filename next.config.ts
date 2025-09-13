import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare/dev";

const nextConfig: NextConfig = {};

export default initOpenNextCloudflareForDev(nextConfig);
