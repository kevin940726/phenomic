// @flow

import { join } from "path"
import findCacheDir from "find-cache-dir"
import commonWebpackConfig from "./config.common.js"
import { offlinePlugin, offlineEntry } from "../../_utils/offline/webpack.js"
import HardSourceWebpackPlugin from "hard-source-webpack-plugin"

const chunkNameBrowser = "phenomic.browser"

const cacheDir = findCacheDir({ name: "phenomic-hard-source-wp" })

export default (config: PhenomicConfig): WebpackConfig => {
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
          directories: [
            "web_modules",
          ],
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
