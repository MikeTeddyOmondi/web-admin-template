/** @type {import('next').NextConfig} */

import path from 'node:path';
import { cwd } from 'node:process';

const nextConfig = {
  webpack: (
    config,
    { buildId, dev, isServer, defaultLoaders, nextRuntime, webpack }
  ) => {
    // Exclude .node files from being processed by Webpack
    config.module.rules.push({
      test: /\.node$/,
      use: 'ignore-loader',
    });
    
    // Resolve native bindings
    config.resolve.alias['bundler-linux-x64-gnu'] = path.resolve(cwd(), './bundler/bundler.linux-x64-gnu.node');

    // Mark the napi-rs package as external on the server
    if (isServer) {
      config.externals.push({
        'bundler/bundler.linux-x64-gnu.node': 'commonjs2 bundler/bundler.linux-x64-gnu.node',
        'bundler-linux-x64-gnu': 'commonjs2 bundler/bundler.linux-x64-gnu.node'
      });
    }

    // Important: return the modified config
    return config
  },
  experimental: {
    serverComponentsExternalPackages: ["oslo", "@node-rs/argon2", "bundler"]
  }
};

export default nextConfig;
