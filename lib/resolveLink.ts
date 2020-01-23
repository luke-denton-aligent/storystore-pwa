import { useRouter } from 'next/router'
import getConfig from 'next/config'

const { publicRuntimeConfig } = getConfig()

export const resolveLink = (url: string) => {
    try {
        const linkUrl = new URL(url)

        return publicRuntimeConfig.MAGENTO_HOST === linkUrl.host ? linkUrl.pathname + linkUrl.search : url
    } catch (_) {
        return url
    }
}

export const useIsUrlActive = () => {
    const router = useRouter()

    return (href: string) => {
        if (!router) return false

        const { route, query } = router

        return href === (query.url || (query['*'] ? `/${query['*']}` : route))
    }
}
