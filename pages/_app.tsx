import React, { useState, useEffect } from 'react'
import { NextPage } from 'next'
import { overrideSettingsFromCookie } from '../lib/overrideFromCookie'
import createApolloClient from '../lib/apollo/client'
import { ApolloProvider } from '@apollo/react-hooks'
import { ApolloClient } from 'apollo-client'
import { version } from '../package.json'

import NextNprogress from 'nextjs-progressbar'
import { AppProvider } from '@pmet-public/luma-ui/dist/AppProvider'
import App from '../components/App'
import ServiceWorkerProvider from '../components/ServiceWorker'
import ViewLoader from '@pmet-public/luma-ui/dist/components/ViewLoader'

import ReactGA from 'react-ga'

ReactGA.initialize('UA-162672258-1')

const MyApp: NextPage<any> = ({ Component, pageProps, env }) => {
    const [client, setClient] = useState<ApolloClient<any> | undefined>(undefined)

    const { MAGENTO_URL } = env

    /**
     * TypeKit (Fonts)
     */
    useEffect(() => {
        const myCSS = document.createElement('link')
        myCSS.rel = 'stylesheet'
        myCSS.href = '/static/fonts.css'
        document.head.insertBefore(myCSS, document.head.childNodes[document.head.childNodes.length - 1].nextSibling)
    }, [])

    /**
     * Apollo Client (GraphQl)
     */
    useEffect(() => {
        createApolloClient(MAGENTO_URL).then(client => setClient(client))
    }, [MAGENTO_URL, setClient])

    /**
     * Google Analytics
     */
    useEffect(() => {
        if (!env.MAGENTO_URL) return

        ReactGA.event({
            category: 'Magento Url',
            action: new URL(env.MAGENTO_URL).host,
        })

        ReactGA.event({
            category: 'Version',
            action: version,
        })
    }, [env])

    if (client === undefined) return <ViewLoader />

    return (
        <ApolloProvider client={client}>
            <ServiceWorkerProvider>
                <AppProvider>
                    <App footerBlockId={env.FOOTER_BLOCK_ID}>
                        <NextNprogress
                            color="rgba(161, 74, 36, 1)"
                            startPosition={0.4}
                            stopDelayMs={200}
                            height={3}
                            options={{ showSpinner: false, easing: 'ease' }}
                        />
                        <Component apolloClient={client} env={env} {...pageProps} />
                    </App>
                </AppProvider>
            </ServiceWorkerProvider>
        </ApolloProvider>
    )
}

MyApp.getInitialProps = async appContext => {
    const MAGENTO_URL = process.env.MAGENTO_URL
    const HOME_PAGE_ID = process.env.HOME_PAGE_ID
    const FOOTER_BLOCK_ID = process.env.FOOTER_BLOCK_ID
    const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY

    const { req } = (appContext as any).ctx

    const { Component } = appContext as any

    const pageProps = Component.getInitialProps ? await Component.getInitialProps(appContext) : {}

    return {
        pageProps,
        env: {
            MAGENTO_URL,
            HOME_PAGE_ID,
            FOOTER_BLOCK_ID,
            GOOGLE_MAPS_API_KEY,
            ...overrideSettingsFromCookie(
                'MAGENTO_URL',
                'HOME_PAGE_ID',
                'FOOTER_BLOCK_ID',
                'GOOGLE_MAPS_API_KEY'
            )(req?.headers),
        },
    }
}

export default MyApp
