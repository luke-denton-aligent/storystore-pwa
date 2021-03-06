import React, { useMemo } from 'react'
import parseHtml, { domToReact, HTMLReactParserOptions } from 'html-react-parser'
import { resolveLink, LinkType } from '~/lib/resolveLink'
import { resolveImage } from '~/lib/resolveImage'

import Link from '~/components/Link'
import Image from '@storystore/ui/dist/components/Image'

const options: HTMLReactParserOptions = {
    replace: ({ name, attribs, children }) => {
        if (name === 'a' && attribs?.href) {
            const style = attribs.style?.split(';').reduce((obj: { [key: string]: string }, x: string) => {
                const [key, value] = x.split(':')
                return key ? { [key]: value.trim(), ...obj } : obj
            }, {})

            const linkHref = attribs.href
            const linkType = attribs['data-link-type'] as LinkType

            return (
                <Link {...resolveLink(linkHref, linkType)} {...attribs} style={style}>
                    {children && domToReact(children, options)}
                </Link>
            )
        }

        if (name === 'img' && attribs?.src) {
            return <Image {...attribs} src={resolveImage(attribs.src)} />
        }
    },
}

export const useHtml = (html?: string) => useMemo(() => html && parseHtml(html, options), [html])
