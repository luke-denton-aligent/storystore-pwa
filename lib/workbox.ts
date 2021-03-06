import { registerRoute, setCatchHandler, setDefaultHandler } from 'workbox-routing'
import { precacheAndRoute, cleanupOutdatedCaches, matchPrecache } from 'workbox-precaching'
import { CacheFirst, StaleWhileRevalidate, NetworkFirst } from 'workbox-strategies'
import { ExpirationPlugin } from 'workbox-expiration'
import { CacheableResponsePlugin } from 'workbox-cacheable-response'
import { skipWaiting, clientsClaim, WorkboxPlugin } from 'workbox-core'

const DAY_IN_SECONDS = 86400

const FALLBACK_HTML_URL = '/offline'

const fetchOptions: RequestInit = {
    credentials: 'include',
}

const plugins: WorkboxPlugin[] = [
    new CacheableResponsePlugin({
        statuses: [0, 200],
    }),
    new ExpirationPlugin({
        maxAgeSeconds: 7 * DAY_IN_SECONDS,
    }),
]

const matchPaths = (paths: string[]) => new RegExp(paths.map(path => new URL(path, self.location.href).href).join('|'))

clientsClaim()

skipWaiting()

precacheAndRoute(
    [
        // Precached routes
        { url: FALLBACK_HTML_URL, revision: Date.now() },
        ...(self as any).__WB_MANIFEST,
    ] || []
)

cleanupOutdatedCaches()

/**
 * Routes
 */

// Images API
registerRoute(
    matchPaths(['/api/images']),
    new CacheFirst({
        cacheName: 'api-images',
        fetchOptions,
        plugins,
    })
)

// Static resources
registerRoute(
    matchPaths(['/static', '/robots.txt', '/manifest.webmanifest']),
    new StaleWhileRevalidate({
        cacheName: 'static',
        fetchOptions,
        plugins,
    })
)

// Adobe Fonts (Typekit)
registerRoute(
    /^https:\/\/use.typekit.net/,
    new StaleWhileRevalidate({
        cacheName: 'typekit',
        plugins,
    })
)

/**
 * Fallback (default handler)
 */

setDefaultHandler(args => {
    const { url } = args
    const request = args.request as any

    if (url?.hostname === self.location.hostname && request?.method === 'GET') {
        // console.log(`⚙️ Running ${url.pathname} through offline cache.`, request)
        return new NetworkFirst({
            cacheName: 'offline',
            fetchOptions,
            plugins,
        }).handle(args)
    }

    return fetch(args.event.request || args.request)
})

setCatchHandler(args => {
    const { url, request } = args as any

    if (url.host === self.location.host && request.method === 'GET' && request.destination === 'document') {
        // console.log(`⚙️ Serving Offline Page for ${url.pathname}.`)
        return matchPrecache(FALLBACK_HTML_URL)
    }

    return Response.error() as any
})
