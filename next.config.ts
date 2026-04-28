import type { NextConfig } from "next";
import nextra from "nextra";

const withNextra = nextra({
  readingTime: true,
  search: true,
  staticImage: true,
});

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  // cacheComponents: true,
  skipTrailingSlashRedirect: true,
  // reactCompiler: true,
  experimental: {
    // viewTransition: true,
  },
};

export default withNextra(nextConfig);
