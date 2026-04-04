/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    esmExternals: 'loose',
  },
  webpack: (config, { isServer }) => {
    // Ignore native .node files
    config.module.rules.push({
      test: /\.node$/,
      use: 'ignore-loader',
    });

    if (!isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        'onnxruntime-node': false,
        'sharp': false,
      };
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
      };
    }

    return config;
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'require-corp',
          },
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin',
          },
        ],
      },
    ];
  },
}

module.exports = nextConfig
