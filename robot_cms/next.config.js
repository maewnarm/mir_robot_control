const path = require('path')
const webpack = require('webpack')

const withAntdLess = require('next-plugin-antd-less')
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})
const lessToJS = require('less-vars-to-js')
const fs = require('fs')

const basePath = process.env.NEXT_PUBLIC_BASE_PATH

const antdVariables = lessToJS(
  fs.readFileSync(path.resolve(__dirname, 'src/styles/variables.less'), 'utf8')
)

module.exports = withBundleAnalyzer(
  withAntdLess({
    output: 'standalone',
    basePath: basePath ? basePath : '',
    swcMinify: true,
    experimental: {
      forceSwcTransforms: true,
    },
    async redirects () {
      return [
        {
          source: '/',
          destination: '/manage-robot',
          permanent: false
        }
      ]
    },
    webpack(config) {
      config.module.rules.push({
        test: /\.md$/,
        use: 'frontmatter-markdown-loader',
      })

      config.plugins.push(
        new webpack.EnvironmentPlugin({
          NODE_ENV: process.env.NODE_ENV,
          THEME: { ...antdVariables },
        })
      )

      return config
    },
  })
)
