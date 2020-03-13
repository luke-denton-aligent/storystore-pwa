/**
 * ☢️ Experimental
 */

import React, { useMemo, Suspense } from 'react'
import { Root, RichText } from './PageBuilder.styled'
import { Component } from '@pmet-public/luma-ui/dist/lib'
import { ErrorBoundary } from '@pmet-public/luma-ui/dist/lib'
import { htmlToProps } from './lib/parser'
import { isPageBuilderHtml } from './lib/utils'

export type PageBuilderProps = {
    html: string
}

type PageBuilderFactoryProps = {
    component: Component
    items: any[]
    props: {
        [prop: string]: any
    }
}

const renderComponent = (Component: React.ComponentType<any>, props: any, items: any[]) => {
    return (
        <Component {...props}>
            {items.map((itemProps, index) => (
                <PageBuilderFactory key={index} {...itemProps} />
            ))}
        </Component>
    )
}

const PageBuilderFactory: Component<PageBuilderFactoryProps> = ({ component, items, props }) => {
    return (
        <Suspense fallback="">
            {component ? <ErrorBoundary>{renderComponent(component, props, items)}</ErrorBoundary> : null}
        </Suspense>
    )
}

export const PageBuilder: Component<PageBuilderProps> = ({ html, ...props }) => {
    const usePageBuilder = useMemo(() => isPageBuilderHtml(html), [html])

    const items = useMemo(() => {
        if (!html || !usePageBuilder) return
        return htmlToProps(html).items
    }, [html, usePageBuilder])

    return (
        <Root {...props}>
            {usePageBuilder ? (
                items.map((contentType: any, index: number) => <PageBuilderFactory key={index} {...contentType} />)
            ) : (
                <RichText dangerouslySetInnerHTML={{ __html: html }} />
            )}
        </Root>
    )
}
