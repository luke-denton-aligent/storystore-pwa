import React from 'react'
import dynamic from 'next/dynamic'
import { NextComponentType } from 'next'
import { getCookieValueFromString } from '../lib/cookies'

import Link from '../components/Link'

const Error = dynamic(() => import('../components/Error'))
const Page = dynamic(() => import('../components/Page '))
const Category = dynamic(() => import('../components/Category'))
const Product = dynamic(() => import('../components/Product'))

export type ResolverProps = {
    contentId: number
    urlKey: string
    type: 'CMS_PAGE' | 'CATEGORY' | 'PRODUCT' | '404'
}

const UrlResolver: NextComponentType<any, any, ResolverProps> = ({ type, contentId, urlKey }) => {
    switch (type) {
        case 'CMS_PAGE':
            return <Page key={contentId} id={contentId} />
        case 'CATEGORY':
            return <Category key={contentId} id={contentId} />
        case 'PRODUCT':
            return <Product key={urlKey} urlKey={urlKey} />
        case '404':
            return <Error type="404" button={{ text: 'Look around', as: Link, href: '/' }} />
        default:
            return (
                <Error type="500" button={{ text: 'Reload', onClick: () => window.location.reload() }}>
                    Internal Error: {type} is not valid
                </Error>
            )
    }
}

UrlResolver.getInitialProps = async ({ req, res, query }) => {
    const graphQLUrl = process.browser
        ? new URL('/api/graphql', location.href).href
        : new URL('graphql', getCookieValueFromString(req.headers.cookie, 'MAGENTO,URL') || process.env.MAGENTO_URL)
              .href

    const url = query.url ? query.url.toString().split('?')[0] : query[''].join('/')

    const urlKey =
        url
            .split('/')
            .pop()
            .split('.')[0] || ''

    if (query.type) {
        const type = query.type
        const contentId = Number(query.contentId)
        return { type, contentId, urlKey }
    }

    const graphQlQuery = `query%20%7B%0A%20%20urlResolver(url:%20"${url}")%20%7B%0A%20%20%20%20contentId:%20id%0A%20%20%20%20type%0A%20%20%7D%0A%7D`
    try {
        const page = await fetch(`${graphQLUrl}?query=${graphQlQuery}`)

        const { data = {} } = await page.json()

        const { type = '404', contentId } = data.urlResolver || {}

        if (type === '404') res.statusCode = 404

        return { type, contentId, urlKey }
    } catch (e) {
        res.statusCode = 500
    }
}

export default UrlResolver
