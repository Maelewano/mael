import bundleAnalyzer from "@next/bundle-analyzer"
import { withSentryConfig } from "@sentry/nextjs";
import withPlugins from "next-compose-plugins"

import { env } from "./env.mjs"

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,

    // Enable source maps only in production when needed
    productionBrowserSourceMaps: process.env.NODE_ENV === 'production' && process.env.ENABLE_SOURCE_MAPS === 'true',

    // Add experimental features for faster builds
    experimental: {
        // Enable faster refresh
        optimizePackageImports: [
            '@heroicons/react',
            'lucide-react',
            'date-fns',
            'lodash-es',
            'zod',
            '@sentry/nextjs',
            '@headlessui/react',
        ], // Add commonly used packages

        // Reduce memory usage
        memoryBasedWorkersCount: true,
    },

    turbopack: {
        rules: {
            '*.svg': {
                loaders: ['@svgr/webpack'],
                as: '*.js',
            },
        },
    },

    serverExternalPackages: ['@dropbox/sign'],

    webpack: (config, { dev, isServer }) => {
        // Punycode fallback
        if (!isServer) {
            config.resolve.fallback = {
                ...config.resolve.fallback,
                punycode: false,
            };
        }

        // Dev settings
        if (dev) {
            config.watchOptions = {
                poll: 1000,
                aggregateTimeout: 300,
                ignored: ['**/node_modules/**',
                    '**/.git/**',
                    '**/.next/**',
                    '**/coverage/**',
                    '**/.nyc_output/**',],
            }
            // Disable some optimizations in dev for faster builds
            config.optimization = {
                ...config.optimization,
                removeAvailableModules: false,
                removeEmptyChunks: false,
                splitChunks: false,
            }
        }

        return config;
    },
    logging: {
        fetches: {
            fullUrl: true,
        },
    },
    rewrites() {
        return [
            { source: '/:path*', destination: '/:path*' },
            { source: "/healthz", destination: "/api/health" },
            { source: "/api/healthz", destination: "/api/health" },
            { source: "/health", destination: "/api/health" },
            { source: "/ping", destination: "/api/health" },
        ]
    },
    images: {
        formats: ["image/avif", "image/webp"],
        dangerouslyAllowSVG: true,
        contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",

        remotePatterns: [
            {
                protocol: "https",
                hostname: "images.prismic.io",
            },
            {
                protocol: "https",
                hostname: "images.unsplash.com",
            },
            {
                protocol: "https",
                hostname: "tailwindui.com",
            },
            {
                protocol: "https",
                hostname: "tecdn.b-cdn.net",
            },
            {
                protocol: "https",
                hostname: "lh3.googleusercontent.com",
            },
            {
                protocol: "https",
                hostname: "graph.facebook.com",
            },
            {
                protocol: "https",
                hostname: "www.facebook.com",
            },
            {
                protocol: "https",
                hostname: "via.placeholder.com", // For placeholder images
            },
        ],
    },
};

const withBundleAnalyzer = bundleAnalyzer({ enabled: Boolean(env.ANALYZE) });

// Sentry configuration
const sentryOptions = {
    org: "cheetahws",  // Use Organization Slug, not Display Name
    project: "mael",
    silent: !process.env.CI,
    widenClientFileUpload: true, // Increases build time
    hideSourceMaps: true,
    
    // Use webpack.treeshake.removeDebugLogging instead of disableLogger
    webpack: {
        treeshake: {
            removeDebugLogging: true,
        },
        // Use webpack.automaticVercelMonitors instead of automaticVercelMonitors
        automaticVercelMonitors: true,
    },
    
    telemetry: false,

    // Disable Sentry webpack plugin in development for faster builds
    disableServerWebpackPlugin: process.env.NODE_ENV !== 'production',
    disableClientWebpackPlugin: process.env.NODE_ENV !== 'production',

    // Only enable tunnel route in production
    ...(process.env.NODE_ENV === 'production' && { tunnelRoute: "/monitoring" }),
};

export default withSentryConfig(withPlugins([withBundleAnalyzer], nextConfig), sentryOptions);