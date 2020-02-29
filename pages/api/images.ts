import request from 'request'
import { URL } from 'url'
import { NextApiRequest, NextApiResponse } from 'next'

const maxAge = 30 * 86400 // 30 days 31536000

export const ImagesApi = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const url = new URL(req.query.url.toString(), process.env.MAGENTO_URL).href

        req.pipe(
            request.get({
                qs: req.query,
                url,
                pool: {
                    maxSockets: Infinity,
                },
            })
        )
            .once('response', response => {
                response.headers['Cache-Control'] = `max-age=${maxAge}, immutable`
            })
            .pipe(res)
    } catch (error) {
        console.error(error)
        res.status(500).end()
    }
}

export default ImagesApi
