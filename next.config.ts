// next.config.ts
import withPWA from "next-pwa";

const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
};

// aqui forçamos `nextConfig` como `any` para driblar o conflito
export default withPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
})(nextConfig as any);
