import Document, { Head, Main, NextScript } from 'next/document'
import { ServerStyleSheet } from 'styled-components'
import { sync as dataUri } from 'datauri'
import { relative } from 'path'

export default class extends Document {
    static async getInitialProps(ctx: any) {
        const sheet = new ServerStyleSheet()
        const originalRenderPage = ctx.renderPage
        const locationOrigin = process.browser ? location.origin : ''

        try {
            ctx.renderPage = () =>
                originalRenderPage({
                    enhanceApp: (App: any) => (props: any) => sheet.collectStyles(<App {...props} />),
                })

            const initialProps = await Document.getInitialProps(ctx)
            return {
                ...initialProps,
                locationOrigin,
                styles: (
                    <>
                        {initialProps.styles}
                        {sheet.getStyleElement()}
                    </>
                ),
            }
        } finally {
            sheet.seal()
        }
    }

    render() {
        return (
            <html lang="en">
                <Head>
                    <noscript>Enable javascript to run this web app.</noscript>
                    <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
                    <meta charSet="utf-8" />
                    <meta
                        name="viewport"
                        content="width=device-width, minimum-scale=1, initial-scale=1, viewport-fit=cover"
                    />
                    <meta name="theme-color" content="#222222" />
                    <link rel="shortcut icon" href="/static/favicon.ico" />

                    {/* iOS */}
                    <meta name="apple-mobile-web-app-capable" content="yes" />
                    <meta name="apple-mobile-web-app-status-bar-style" content="black" />
                    <meta name="apple-mobile-web-app-title" content="Luma" />

                    <link rel="apple-touch-startup-image" crossOrigin="use-credentials" />
                    <link
                        rel="apple-touch-icon"
                        href={dataUri(relative(process.cwd(), './public/static/icons/apple-touch-icon.png'))}
                        crossOrigin="use-credentials"
                    />

                    {/* Web App Manifest  */}
                    <link rel="manifest" href="/manifest.webmanifest" crossOrigin="use-credentials" />

                    {/* Fonts */}
                    <link rel="stylesheet" href="/static/fonts.css" />

                    {/* Preload App Shell */}
                    <link rel="preload" href="/" />
                </Head>

                <body>
                    <Main />
                    <NextScript />
                </body>
            </html>
        )
    }
}
