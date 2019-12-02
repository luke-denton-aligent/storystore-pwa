require('dotenv').config()
const webpack = require('webpack')
const withOffline = require('next-offline')

const runtimeDefaultCacheOptions = {
    cacheableResponse: {
        statuses: [0, 200],
    },
    fetchOptions: {
        credentials: 'same-origin',
    },
}


module.exports = withOffline({

    workboxOpts: {
        modifyURLPrefix: {
            'static/': '_next/static/',
            'public': '',
        },
        navigationPreload: true,
        cleanupOutdatedCaches: true,
        runtimeCaching: [
            {
                urlPattern: /^https?((?!\/graphql).)*$/, //all but GraphQL
                handler: 'StaleWhileRevalidate',
                options: {
                    cacheName: 'offline-cache',
                    ...runtimeDefaultCacheOptions,
                },
            },
            {
                urlPattern: /\/graphql/,
                handler: 'NetworkFirst',
                options: {
                    cacheName: 'graphql-cache',
                    ...runtimeDefaultCacheOptions,
                },
            },
        ]
    },
    webpack: config => {
        /**
         * Luma PWA Variable
         */
        config.plugins.push(
            new webpack.DefinePlugin({
                LUMA_ENV: {
                    MAGENTO_URL: JSON.stringify(process.env.MAGENTO_URL),
                    CONTENT_HOME_PAGE_ID: Number(process.env.CONTENT_HOME_PAGE_ID),
                    CONTENT_PARENT_CATEGORIES_ID: Number(process.env.CONTENT_PARENT_CATEGORIES_ID),
                    CONTENT_FOOTER_BLOCK_ID: JSON.stringify(process.env.CONTENT_FOOTER_BLOCK_ID),
                    DEVELOPMENT: process.env.NODE_ENV !== 'production',
                },
            })
        )

        /**
         * SVG Inline
         */
        config.module.rules.push({
            test: /\.svg$/,
            use: 'react-svg-loader',
        })

        /**
         * GraphQL Queries
         */
        config.module.rules.push({
            test: /\.(graphql|gql)$/,
            exclude: /node_modules/,
            loader: 'graphql-tag/loader',
        })

        /**
         * Fix for missing 'fs' module not found
         * https://github.com/webpack-contrib/css-loader/issues/447
         */
        config.node = {
            fs: 'empty',
        }

        return config
    },
})
