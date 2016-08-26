// @flow

import { join } from "path"
import findCacheDir from "find-cache-dir"
import commonWebpackConfig from "./config.common.js"
import { offlinePlugin, offlineEntry } from "../../_utils/offline/webpack.js"
import HardSourceWebpackPlugin from "hard-source-webpack-plugin"

const chunkNameBrowser = "phenomic.browser"

export default (config: PhenomicConfig): WebpackConfig => {
  // Use different cache folder for hard-source-webpack-plugin on each env
  const env = (config.production) ? "prod" : "dev"
  const cacheDir = findCacheDir({ name: "phenomic-hard-source-wp" + env })

  const webpackConfig = commonWebpackConfig(config)

  return {
    ...webpackConfig,
    recordsPath: join(cacheDir, "records.json"),
    plugins: [
      ...webpackConfig.plugins,
      ...offlinePlugin(config),
      new HardSourceWebpackPlugin({
        cacheDirectory: join(cacheDir, "cacheDirectory"),
        environmentPaths: {
          root: config.cwd,
          files: [
            "package.json",
            "webpack.config.babel.js",
          ],
        },
      }),
    ],

    entry: {
      ...config.webpackConfig ? config.webpackConfig.entry : {},

      [chunkNameBrowser]: [
        join(config.cwd, config.scriptBrowser),
        ...offlineEntry(config),
      ],
    },
  }
}
