import path from 'path'
import { config } from 'dotenv'

import NextBundleAnalyzer from '@next/bundle-analyzer'
import { withSentryConfig } from '@sentry/nextjs'

process.title = 'Shiro (NextJS)'

const env = config().parsed || {}
const isProd = process.env.NODE_ENV === 'production'

/** @type {import('next').NextConfig} */
// eslint-disable-next-line import/no-mutable-exports
let nextConfig = {
  reactStrictMode: true,
  productionBrowserSourceMaps: false,
  output: 'standalone',
  assetPrefix: isProd ? env.ASSETPREFIX || undefined : undefined,
  compiler: {
    // reactRemoveProperties: { properties: ['^data-id$', '^data-(\\w+)-id$'] },
  },
  experimental: {
    serverMinification: true,

    // @see https://vercel.com/blog/version-skew-protection
    useDeploymentId: true,
    webpackBuildWorker: true,
    useDeploymentIdServerActions: true,
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy:
      "default-src 'self'; script-src 'none'; sandbox; style-src 'unsafe-inline';",
  },

  async rewrites() {
    return {
      beforeFiles: [
        { source: '/atom.xml', destination: '/feed' },
        { source: '/feed.xml', destination: '/feed' },
        { source: '/sitemap.xml', destination: '/sitemap' },
      ],
    }
  },

  webpack: (config, { webpack }) => {
    const __dirname = new URL('./', import.meta.url).pathname
    config.resolve.alias['jotai'] = path.resolve(
      __dirname,
      'node_modules/jotai',
    )

    config.externals.push({
      'utf-8-validate': 'commonjs utf-8-validate',
      bufferutil: 'commonjs bufferutil',
    })

    // config.plugins.push(
    //   new webpack.optimize.MinChunkSizePlugin({
    //     minChunkSize: 1024 * 100, // Minimum number of characters
    //   }),
    // )

    return config
  },
}

if (process.env.ANALYZE === 'true') {
  nextConfig = NextBundleAnalyzer({
    enabled: true,
  })(nextConfig)
}

export default withSentryConfig(
  nextConfig,
  {
    // For all available options, see:
    // https://github.com/getsentry/sentry-webpack-plugin#options

    // Suppresses source map uploading logs during build
    silent: true,
    org: 'mx-space',
    project: 'web',
  },
  {
    // For all available options, see:
    // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

    // Upload a larger set of source maps for prettier stack traces (increases build time)
    widenClientFileUpload: true,

    // Transpiles SDK to be compatible with IE11 (increases bundle size)
    transpileClientSDK: true,

    // Routes browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers. (increases server load)
    // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
    // side errors will fail.
    tunnelRoute: '/monitoring',

    // Hides source maps from generated client bundles
    hideSourceMaps: true,

    // Automatically tree-shake Sentry logger statements to reduce bundle size
    disableLogger: true,

    // Enables automatic instrumentation of Vercel Cron Monitors.
    // See the following for more information:
    // https://docs.sentry.io/product/crons/
    // https://vercel.com/docs/cron-jobs
    automaticVercelMonitors: true,
  },
)
